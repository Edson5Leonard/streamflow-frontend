'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { fetchApi } from '@/lib/api';
import type { Pago } from '@/types/pago';
import { CredentialCard } from '@/components/client/CredentialCard';
import { PaymentInstructions } from '@/components/payments/PaymentInstructions';

interface Servicio {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precioMayorista: number;
}

interface CuentaDisponible {
  id: string;
  servicioId: string;
  precioVenta: number | null;
}

interface Producto extends Servicio {
  precio: number;
  stockDisponible: number;
}

interface Sesion {
  distribuidorId: string;
  distribuidorWhatsapp: string | null;
  nombreCompleto: string;
  whatsapp: string | null;
}

interface Compra {
  id: string;
  servicio: string;
  correo: string;
  password: string;
  perfilPin: string | null;
  fechaVenta: string;
}

type MetodoPago = Pago['metodoPago'];

export default function CatalogoCompradorPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [stock, setStock] = useState<CuentaDisponible[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('YAPE');
  const [codigoOperacion, setCodigoOperacion] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [pagoPendiente, setPagoPendiente] = useState<Pago | null>(null);
  const [credenciales, setCredenciales] = useState<Compra | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const cargarCatalogo = useCallback(async () => {
    const [serviciosData, stockData, sesionData] = await Promise.all([
      fetchApi<Servicio[]>('/servicios/activos'),
      fetchApi<CuentaDisponible[]>('/cuentas/disponibles'),
      fetchApi<Sesion>('/auth/me'),
    ]);
    setServicios(serviciosData);
    setStock(stockData);
    setSesion(sesionData);
    setNombreCompleto(sesionData.nombreCompleto);
    setWhatsapp(sesionData.whatsapp ?? '');
  }, []);

  useEffect(() => {
    Promise.resolve()
      .then(cargarCatalogo)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar el catálogo.'))
      .finally(() => setLoading(false));
  }, [cargarCatalogo]);

  useEffect(() => {
    if (!pagoPendiente || pagoPendiente.estado !== 'PENDIENTE') return;
    let active = true;
    let timer: number | undefined;
    const consultarEstado = async () => {
      try {
        const pagoActualizado = await fetchApi<Pago>(`/pagos/${pagoPendiente.id}`);
        if (!active) return;
        if (pagoActualizado.estado === 'APROBADO') {
          setPagoPendiente(pagoActualizado);
          const compra = await fetchApi<Compra>(`/ventas/pago/${pagoPendiente.id}`);
          if (active) {
            setCredenciales(compra);
          }
          return;
        }
        if (pagoActualizado.estado === 'RECHAZADO') {
          setPagoPendiente(pagoActualizado);
          return;
        }
        timer = window.setTimeout(consultarEstado, 4000);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'No se pudo consultar el estado del pago.');
        timer = window.setTimeout(consultarEstado, 8000);
      }
    };
    timer = window.setTimeout(consultarEstado, 4000);
    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [pagoPendiente]);

  const serviciosConStock: Producto[] = servicios
    .map((servicio) => {
      const cuentas = stock.filter((cuenta) => cuenta.servicioId === servicio.id);
      return {
        ...servicio,
        precio: cuentas[0]?.precioVenta ?? servicio.precioMayorista,
        stockDisponible: cuentas.length,
      };
    })
    .filter((servicio) => servicio.stockDisponible > 0);

  const enviarPedido = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productoSeleccionado || !comprobante || !sesion?.distribuidorId || !nombreCompleto.trim() || !whatsapp.trim()) {
      setError('Completa tus datos de contacto y adjunta el comprobante.');
      return;
    }

    const pestañaWhatsApp = window.open('about:blank', '_blank');
    setEnviando(true);
    setError('');
    setMensaje('');
    const formData = new FormData();
    formData.append('distribuidorId', sesion.distribuidorId);
    formData.append('nombreCompleto', nombreCompleto.trim());
    formData.append('whatsapp', whatsapp.trim());
    formData.append('servicioId', productoSeleccionado.id);
    formData.append('metodoPago', metodoPago);
    formData.append('codigoOperacion', codigoOperacion.trim());
    formData.append('comprobante', comprobante);

    try {
      const pago = await fetchApi<Pago>('/pagos/solicitar', { method: 'POST', body: formData });
      setPagoPendiente(pago);
      setCredenciales(null);
      setMensaje('Pedido registrado. La pantalla se actualizará automáticamente cuando el distribuidor lo apruebe.');
      const texto = `Hola, envié el pago de ${productoSeleccionado.nombre} por S/ ${Number(pago.monto).toFixed(2)}. Código de pedido: ${pago.id}.`;
      const telefonoTienda = (sesion.distribuidorWhatsapp ?? '').replace(/[^0-9]/g, '');
      const destinoWhatsApp = `https://wa.me/${telefonoTienda}?text=${encodeURIComponent(texto)}`;
      setWhatsappUrl(destinoWhatsApp);
      if (pestañaWhatsApp) pestañaWhatsApp.location.href = destinoWhatsApp;
      setProductoSeleccionado(null);
      setCodigoOperacion('');
      setComprobante(null);
      await cargarCatalogo().catch((err: unknown) => {
        setError(err instanceof Error ? `Pedido registrado, pero no se pudo actualizar el catálogo: ${err.message}` : 'Pedido registrado, pero no se pudo actualizar el catálogo.');
      });
    } catch (err) {
      pestañaWhatsApp?.close();
      setError(err instanceof Error ? err.message : 'No se pudo registrar el pedido.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Catálogo de servicios</h1>
        <p className="mt-1 text-sm text-gray-400">
          Elige un servicio, realiza el pago directo y envía el comprobante para su validación.
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {mensaje && <p role="status" className="rounded-xl border border-green-800 bg-green-950/40 p-4 text-sm text-green-300">{mensaje}</p>}
      {pagoPendiente && (
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">Seguimiento de tu pedido</p>
              <p className="mt-1 text-xs text-slate-500">Referencia {pagoPendiente.id}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              pagoPendiente.estado === 'APROBADO' ? 'bg-emerald-500/10 text-emerald-400'
                : pagoPendiente.estado === 'RECHAZADO' ? 'bg-red-500/10 text-red-400'
                  : 'bg-amber-500/10 text-amber-400'
            }`}>
              {pagoPendiente.estado === 'PENDIENTE' ? 'Validando pago' : pagoPendiente.estado}
            </span>
          </div>
          {pagoPendiente.estado === 'PENDIENTE' && <p className="text-sm text-slate-400">Esta página revisa el estado cada pocos segundos. Puedes mantenerla abierta.</p>}
          {pagoPendiente.estado === 'RECHAZADO' && <p role="alert" className="text-sm text-red-300">Pago rechazado: {pagoPendiente.motivoRechazo ?? 'comunícate con la tienda para más información.'}</p>}
          {pagoPendiente.estado === 'APROBADO' && credenciales && (
            <CredentialCard
              servicio={credenciales.servicio}
              correo={credenciales.correo}
              password={credenciales.password}
              perfilPin={credenciales.perfilPin}
              fecha={credenciales.fechaVenta}
            />
          )}
          {pagoPendiente.estado === 'APROBADO' && !credenciales && (
            <p className="text-sm text-amber-300">El pago fue aprobado. Actualiza el historial para ver las credenciales.</p>
          )}
          {whatsappUrl && <a className="text-sm text-emerald-400 underline underline-offset-4" href={whatsappUrl} target="_blank" rel="noreferrer">Abrir el mensaje de WhatsApp de nuevo</a>}
        </section>
      )}
      {loading && <p className="text-sm text-gray-400">Cargando catálogo...</p>}
      {!loading && serviciosConStock.length === 0 && !error && (
        <p className="text-sm text-gray-400">No hay cuentas disponibles en esta tienda.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {serviciosConStock.map((producto) => (
          <article key={producto.id} className="flex flex-col justify-between space-y-4 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div className="space-y-3">
              <div className="text-4xl" aria-hidden="true">📺</div>
              <h2 className="text-lg font-bold text-white">{producto.nombre}</h2>
              <p className="text-xs text-gray-400">{producto.categoria}</p>
              {producto.descripcion && <p className="text-sm text-gray-400">{producto.descripcion}</p>}
              <p className="text-xs font-semibold text-blue-400">Disponible: {producto.stockDisponible}</p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
              <span className="text-lg font-black text-green-400">S/ {producto.precio.toFixed(2)}</span>
              <button
                type="button"
                onClick={() => {
                  setProductoSeleccionado(producto);
                  setMensaje('');
                  setError('');
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-500"
              >
                Comprar
              </button>
            </div>
          </article>
        ))}
      </div>

      {productoSeleccionado && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm">
        <section role="dialog" aria-modal="true" aria-labelledby="checkout-title" className="mx-auto mt-8 max-w-2xl space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="checkout-title" className="text-xl font-bold text-white">Pagar pedido: {productoSeleccionado.nombre}</h2>
              <p className="mt-1 text-sm text-gray-400">Importe del pedido: S/ {productoSeleccionado.precio.toFixed(2)}</p>
            </div>
            <button type="button" onClick={() => setProductoSeleccionado(null)} className="text-sm text-gray-400 hover:text-white">
              Cancelar
            </button>
          </div>

          <form onSubmit={enviarPedido} className="space-y-4">
            <label className="block space-y-2 text-sm text-gray-300">
              <span>Nombre completo</span>
              <input required maxLength={120} value={nombreCompleto} onChange={(event) => setNombreCompleto(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white" />
            </label>
            <label className="block space-y-2 text-sm text-gray-300">
              <span>WhatsApp / teléfono</span>
              <input required maxLength={20} value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white" placeholder="+51 999 999 999" />
            </label>
            <PaymentInstructions metodo={metodoPago} onMetodoChange={setMetodoPago} />

            <label className="block space-y-2 text-sm text-gray-300">
              <span>Código de operación</span>
              <input
                required={metodoPago !== 'INTERNACIONAL'}
                maxLength={100}
                value={codigoOperacion}
                onChange={(event) => setCodigoOperacion(event.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
                placeholder={metodoPago === 'INTERNACIONAL' ? 'Código de transferencia o MTCN (si aplica)' : 'Número de operación'}
              />
            </label>

            <label className="block space-y-2 text-sm text-gray-300">
              <span>Comprobante (JPG, PNG o WEBP; máximo 5 MB)</span>
              <input
                required
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => setComprobante(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white"
              />
            </label>

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-xl bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enviando ? 'Enviando pedido...' : 'Enviar comprobante y pedido'}
            </button>
          </form>
        </section>
        </div>
      )}
    </div>
  );
}
