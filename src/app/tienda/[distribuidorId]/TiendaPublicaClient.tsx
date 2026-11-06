'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { CredentialCard } from '@/components/client/CredentialCard';
import { PaymentInstructions, type MetodoPago } from '@/components/payments/PaymentInstructions';

interface Producto {
  servicioId: string;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  precio: number;
  stockDisponible: number;
}

interface CatalogoTienda {
  nombreTienda: string;
  whatsapp: string | null;
  productos: Producto[];
}

interface Solicitud {
  id: string;
  estado: string;
  monto: number;
  tokenPublico: string;
}

interface PedidoCarrito extends Solicitud {
  servicioId: string;
  nombreServicio: string;
}

interface Compra {
  id: string;
  servicio: string;
  correo: string;
  password: string;
  perfilPin: string | null;
  fechaVenta: string;
}

interface Seguimiento {
  id: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  motivoRechazo: string | null;
  garantiaUsada: boolean;
  reclamoPendiente: boolean;
  compra: Compra | null;
}

export default function TiendaPublicaClient({
  params,
}: {
  params: Promise<{ distribuidorId: string }>;
}) {
  const { distribuidorId } = use(params);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombreTienda, setNombreTienda] = useState('');
  const [whatsappTienda, setWhatsappTienda] = useState<string | null>(null);
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [pasarelaAbierta, setPasarelaAbierta] = useState(false);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('YAPE');
  const [codigoOperacion, setCodigoOperacion] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [pedidos, setPedidos] = useState<PedidoCarrito[]>([]);
  const [seguimientos, setSeguimientos] = useState<Record<string, Seguimiento>>({});
  const [mensajeWhatsApp, setMensajeWhatsApp] = useState('');
  const [categoriaFallo, setCategoriaFallo] = useState('Contraseña incorrecta');
  const [motivoFallo, setMotivoFallo] = useState('');
  const [evidenciaFallo, setEvidenciaFallo] = useState<File | null>(null);
  const [enviandoGarantia, setEnviandoGarantia] = useState(false);
  const [mensajeGarantia, setMensajeGarantia] = useState('');
  const [reportesEnviados, setReportesEnviados] = useState<Record<string, boolean>>({});
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const accionInicialProcesada = useRef(false);
  const productosCarrito = productos.filter((item) => (carrito[item.servicioId] ?? 0) > 0);
  const cantidadCarrito = Object.values(carrito).reduce((total, cantidad) => total + cantidad, 0);
  const totalCarrito = productosCarrito.reduce(
    (total, item) => total + Number(item.precio) * (carrito[item.servicioId] ?? 0),
    0,
  );
  const productosSinStock = productosCarrito.filter(
    (item) => (carrito[item.servicioId] ?? 0) > item.stockDisponible,
  );
  const pedido = pedidos[0] ?? null;
  const seguimiento = pedido ? seguimientos[pedido.id] ?? null : null;

  const cargarCatalogo = useCallback(async () => {
    const catalogo = await fetchApi<CatalogoTienda>(`/tiendas/${encodeURIComponent(distribuidorId)}/catalogo`);
    setProductos(catalogo.productos);
    setNombreTienda(catalogo.nombreTienda);
    setWhatsappTienda(catalogo.whatsapp);
  }, [distribuidorId]);

  useEffect(() => {
    Promise.resolve()
      .then(cargarCatalogo)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar esta tienda.'))
      .finally(() => setCargando(false));
    const params = new URLSearchParams(window.location.search);
    const grupo = params.get('pedidos');
    if (grupo) {
      try {
        const guardados = JSON.parse(grupo) as PedidoCarrito[];
        if (Array.isArray(guardados)) {
          Promise.resolve().then(() => setPedidos(guardados));
        }
      } catch {
        Promise.resolve().then(() => setError('No se pudo recuperar el seguimiento de tus pedidos.'));
      }
    } else {
      const id = params.get('pago');
      const token = params.get('token');
      if (id && token) {
        void fetchApi<Seguimiento>(`/pagos/publico/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`)
          .then((estado) => {
            setSeguimientos({ [id]: estado });
            setPedidos([{ id, tokenPublico: token, estado: estado.estado, monto: 0, servicioId: '', nombreServicio: 'Pedido' }]);
          })
          .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo recuperar el pedido.'));
      }
    }
  }, [cargarCatalogo]);

  useEffect(() => {
    if (cargando || productos.length === 0 || accionInicialProcesada.current) return;
    const params = new URLSearchParams(window.location.search);
    const servicioId = params.get('servicioId');
    const accion = params.get('accion');
    if (!servicioId || (accion !== 'pagar' && accion !== 'carrito')) return;

    accionInicialProcesada.current = true;
    const productoSolicitado = productos.find((item) => item.servicioId === servicioId);
    window.history.replaceState(null, '', window.location.pathname);
    if (!productoSolicitado || productoSolicitado.stockDisponible < 1) {
      Promise.resolve().then(() => setError('Este producto ya no tiene stock disponible.'));
      return;
    }

    if ((carrito[servicioId] ?? 0) >= productoSolicitado.stockDisponible || cantidadCarrito >= 20) {
      Promise.resolve().then(() => setError('No puedes añadir más unidades: revisa el stock disponible.'));
      return;
    }
    Promise.resolve().then(() => {
      setCarrito((actual) => ({
        ...actual,
        [servicioId]: (actual[servicioId] ?? 0) + 1,
      }));
      if (accion === 'pagar') setPasarelaAbierta(true);
    });
  }, [cargando, productos, carrito, cantidadCarrito]);

  useEffect(() => {
    if (pedidos.length === 0) return;
    let active = true;
    let timer: number | undefined;
    const consultar = async () => {
      try {
        const estados = await Promise.all(pedidos.map(async (pedidoActual) => {
          const estado = await fetchApi<Seguimiento>(
            `/pagos/publico/${encodeURIComponent(pedidoActual.id)}?token=${encodeURIComponent(pedidoActual.tokenPublico)}`,
          );
          return [pedidoActual.id, estado] as const;
        }));
        if (!active) return;
        const siguientes = Object.fromEntries(estados);
        setSeguimientos((actuales) => ({ ...actuales, ...siguientes }));
        if (estados.some(([, estado]) => estado.estado === 'PENDIENTE')) {
          timer = window.setTimeout(consultar, 5000);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'No se pudo consultar el pedido.');
        if (active) timer = window.setTimeout(consultar, 10000);
      }
    };
    void consultar();
    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [pedidos]);

  const enviarPedido = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (productosSinStock.length > 0) {
      setError('Quita del carrito los productos sin stock antes de pagar.');
      return;
    }
    if (productosCarrito.length === 0 || !comprobante) {
      setError('Añade productos al carrito y adjunta el comprobante.');
      return;
    }
    setEnviando(true);
    setError('');
    const formData = new FormData();
    formData.append('distribuidorId', distribuidorId);
    formData.append('nombreCompleto', nombre.trim());
    formData.append('whatsapp', whatsapp.trim());
    formData.append('metodoPago', metodoPago);
    formData.append('codigoOperacion', codigoOperacion.trim());
    formData.append('comprobante', comprobante);
    const itemsSolicitados = productosCarrito.flatMap((item) =>
      Array.from({ length: carrito[item.servicioId] ?? 0 }, () => item),
    );
    itemsSolicitados.forEach((item) => formData.append('servicioIds', item.servicioId));
    try {
      const solicitudes = await fetchApi<Solicitud[]>('/pagos/solicitar-carrito', {
        method: 'POST',
        body: formData,
      });
      if (solicitudes.length !== itemsSolicitados.length) {
        throw new Error('El servidor no confirmó todos los productos del carrito.');
      }
      const nuevosPedidos = solicitudes.map((solicitud, index) => ({
        ...solicitud,
        servicioId: itemsSolicitados[index].servicioId,
        nombreServicio: itemsSolicitados[index].nombre,
      }));
      setPedidos(nuevosPedidos);
      setSeguimientos({});
      const montoTotal = solicitudes.reduce((total, solicitud) => total + Number(solicitud.monto), 0);
      const mensaje = `Hola, envié el pago de ${solicitudes.length} producto(s) por S/ ${montoTotal.toFixed(2)}. Pedidos: ${solicitudes.map((solicitud) => solicitud.id).join(', ')}.`;
      const url = `https://wa.me/51962266922?text=${encodeURIComponent(mensaje)}`;
      setMensajeWhatsApp(url);
      const params = new URLSearchParams();
      params.set('pedidos', JSON.stringify(nuevosPedidos));
      window.history.replaceState(null, '', `?${params.toString()}`);
      setCarrito({});
      setPasarelaAbierta(false);
      setCodigoOperacion('');
      setComprobante(null);
      await cargarCatalogo();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el pago.');
    } finally {
      setEnviando(false);
    }
  };

  const reportarFalla = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pedido || !evidenciaFallo) {
      setError('Adjunta una captura para reportar la falla.');
      return;
    }
    setEnviandoGarantia(true);
    setError('');
    setMensajeGarantia('');
    const formData = new FormData();
    formData.append('pagoId', pedido.id);
    formData.append('token', pedido.tokenPublico);
    formData.append('categoriaFallo', categoriaFallo);
    formData.append('motivo', motivoFallo);
    formData.append('archivo', evidenciaFallo);
    try {
      await fetchApi('/reclamos/publica', { method: 'POST', body: formData });
      setReportesEnviados((actuales) => ({ ...actuales, [pedido.id]: true }));
      setSeguimientos((actuales) => ({
        ...actuales,
        [pedido.id]: {
          ...actuales[pedido.id],
          reclamoPendiente: true,
        },
      }));
      setMensajeGarantia('Tu reporte de falla fue enviado al distribuidor para revisión. Te avisarán cuando lo resuelvan.');
      setMotivoFallo('');
      setEvidenciaFallo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el reporte de garantía.');
    } finally {
      setEnviandoGarantia(false);
    }
  };

  const agregarAlCarrito = (item: Producto, abrirCheckout = false) => {
    setError('');
    const cantidadActual = carrito[item.servicioId] ?? 0;
    if ((item.stockDisponible > 0 && cantidadActual >= item.stockDisponible) || cantidadCarrito >= 20) {
      setError(item.stockDisponible > 0
        ? 'No puedes añadir más unidades que el stock disponible.'
        : 'El carrito admite hasta 20 unidades por pedido.');
      return;
    }
    setCarrito({ ...carrito, [item.servicioId]: cantidadActual + 1 });
    if (abrirCheckout) setPasarelaAbierta(true);
  };

  const cambiarCantidad = (item: Producto, cambio: number) => {
    if (cambio > 0 && cantidadCarrito >= 20) {
      setError('El carrito admite hasta 20 unidades por pedido.');
      return;
    }
    setCarrito((actual) => {
      const cantidad = actual[item.servicioId] ?? 0;
      const nuevaCantidad = cantidad + cambio;
      if (nuevaCantidad <= 0) {
        const siguiente = { ...actual };
        delete siguiente[item.servicioId];
        return siguiente;
      }
      if (item.stockDisponible > 0 && nuevaCantidad > item.stockDisponible) return actual;
      return { ...actual, [item.servicioId]: nuevaCantidad };
    });
  };

  const solicitarReposicion = (item: Producto) => {
    const telefono = (whatsappTienda || '962266922').replace(/[^0-9]/g, '');
    const telefonoInternacional = telefono.startsWith('51') ? telefono : `51${telefono}`;
    const mensaje = `Hola, soy ${nombre || 'un cliente'}${whatsapp ? ` (${whatsapp})` : ''}. Quiero comprar ${item.nombre}, pero no hay stock disponible. Por favor, soliciten más cuentas al administrador y avísenme cuando esté disponible.`;
    return `https://wa.me/${telefonoInternacional}?text=${encodeURIComponent(mensaje)}`;
  };

  const abrirPasarela = () => {
    setError('');
    if (cantidadCarrito === 0) {
      setError('Añade al menos un producto antes de continuar al pago.');
      return;
    }
    setPasarelaAbierta(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8 px-5 py-10 sm:px-8">
        <header className="border-b border-slate-800 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">StreamFlow · Tienda</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{nombreTienda || 'Servicios de streaming'}</h1>
          <p className="mt-2 text-sm text-slate-400">Elige tus servicios, revisa el total y paga con Yape, Plin, BCP, Interbank o transferencia internacional.</p>
        </header>

        {error && !pasarelaAbierta && <p role="alert" className="rounded-lg border border-red-900/70 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
        {cargando && <p className="text-sm text-slate-500">Cargando catálogo...</p>}
        {!cargando && productos.length === 0 && !error && <p className="text-sm text-slate-400">No hay servicios disponibles en esta tienda.</p>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((item) => (
            <article key={item.servicioId} className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.categoria}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-100">{item.nombre}</h2>
                {item.descripcion && <p className="mt-2 text-sm leading-5 text-slate-400">{item.descripcion}</p>}
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-slate-800 pt-4">
                <div>
                  <p className="text-lg font-semibold text-emerald-400">S/ {Number(item.precio).toFixed(2)}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.stockDisponible} disponibles</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={() => agregarAlCarrito(item, true)} disabled={item.stockDisponible > 0 && (carrito[item.servicioId] ?? 0) >= item.stockDisponible} className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-500 disabled:opacity-50">Continuar al Pago</button>
                  <button type="button" onClick={() => agregarAlCarrito(item)} disabled={item.stockDisponible > 0 && (carrito[item.servicioId] ?? 0) >= item.stockDisponible} className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-700 hover:text-cyan-300 disabled:opacity-50"><ShoppingCart size={16} /> Añadir al carrito</button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section id="como-pagar" className="space-y-5 border-t border-slate-800 py-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Pasarela de pago segura</p>
          <h2 className="text-3xl font-semibold text-white">Cómo pagar</h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-400">Elige uno de los cuatro métodos, realiza la transferencia y sube la captura para que el distribuidor valide tu pedido.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={abrirPasarela} className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-bold text-slate-950 transition hover:brightness-110">Abrir pasarela de pago</button>
            <a href="https://wa.me/51962266922" target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-500">Comunicarse por WhatsApp · 962 266 922</a>
          </div>
        </section>

        {pedidos.length > 0 && (
          <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Seguimiento de tus pedidos</h2>
                <p className="mt-1 text-xs text-slate-500">{pedidos.length} producto(s) · Total S/ {pedidos.reduce((total, item) => total + Number(item.monto), 0).toFixed(2)}</p>
              </div>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">Validación manual</span>
            </div>
            <div className="divide-y divide-slate-800 rounded-lg border border-slate-800">
              {pedidos.map((pedidoActual) => {
                const estado = seguimientos[pedidoActual.id];
                return (
                  <div key={pedidoActual.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{pedidoActual.nombreServicio}</p>
                      <p className="mt-1 text-xs text-slate-500">Referencia {pedidoActual.id} · S/ {Number(pedidoActual.monto).toFixed(2)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      estado?.estado === 'APROBADO' ? 'bg-emerald-500/10 text-emerald-400'
                        : estado?.estado === 'RECHAZADO' ? 'bg-red-500/10 text-red-400'
                          : 'bg-amber-500/10 text-amber-400'
                    }`}>{estado?.estado === 'APROBADO' ? 'Aprobado' : estado?.estado === 'RECHAZADO' ? 'Rechazado' : 'Pendiente'}</span>
                    {estado?.estado === 'RECHAZADO' && <p className="w-full text-sm text-red-300">Motivo: {estado.motivoRechazo ?? 'comunícate con la tienda.'}</p>}
                  </div>
                );
              })}
            </div>
            {seguimiento?.estado === 'PENDIENTE' && <p className="text-sm text-slate-400">Mantén esta página abierta. Se actualizará al aprobar el pago.</p>}
            {seguimiento?.estado === 'RECHAZADO' && <p role="alert" className="text-sm text-red-300">Pago rechazado: {seguimiento.motivoRechazo ?? 'comunícate con la tienda.'}</p>}
            {seguimiento?.compra && (
              <CredentialCard
                servicio={seguimiento.compra.servicio}
                correo={seguimiento.compra.correo}
                password={seguimiento.compra.password}
                perfilPin={seguimiento.compra.perfilPin}
                fecha={seguimiento.compra.fechaVenta}
              />
            )}
            {pedidos.slice(1).map((pedidoActual) => {
              const compra = seguimientos[pedidoActual.id]?.compra;
              return compra ? (
                <CredentialCard
                  key={pedidoActual.id}
                  servicio={compra.servicio}
                  correo={compra.correo}
                  password={compra.password}
                  perfilPin={compra.perfilPin}
                  fecha={compra.fechaVenta}
                />
              ) : null;
            })}
            {pedidos.some((pedidoActual) => seguimientos[pedidoActual.id]?.estado === 'PENDIENTE') && <p className="text-sm text-slate-400">Mantén esta página abierta. Se actualizará al aprobar el pago.</p>}
            {mensajeGarantia && <p role="status" className="rounded-lg border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-300">{mensajeGarantia}</p>}
            {seguimiento?.estado === 'APROBADO' && seguimiento.compra && seguimiento.garantiaUsada && !reportesEnviados[pedido.id] && (
              <p className="text-sm text-slate-400">Esta compra ya recibió un reemplazo de garantía.</p>
            )}
            {seguimiento?.estado === 'APROBADO' && seguimiento.reclamoPendiente && !reportesEnviados[pedido.id] && (
              <p className="text-sm text-amber-300">Tu reporte de falla está pendiente de revisión por el distribuidor.</p>
            )}
            {seguimiento?.estado === 'APROBADO' && seguimiento.compra && reportesEnviados[pedido.id] && (
              <p className="text-sm text-emerald-300">Tu reporte ya está en revisión.</p>
            )}
            {seguimiento?.estado === 'APROBADO' && seguimiento.compra && !seguimiento.garantiaUsada && !seguimiento.reclamoPendiente && !reportesEnviados[pedido.id] && (
              <details className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-200">Reportar una falla</summary>
                <form onSubmit={reportarFalla} className="mt-4 space-y-3">
                  <label className="block space-y-1.5 text-sm text-slate-300">Tipo de falla
                    <select value={categoriaFallo} onChange={(event) => setCategoriaFallo(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white">
                      <option>Contraseña incorrecta</option>
                      <option>Perfil bloqueado o PIN cambiado</option>
                      <option>Suscripción vencida</option>
                      <option>Otro</option>
                    </select>
                  </label>
                  <label className="block space-y-1.5 text-sm text-slate-300">Describe el problema
                    <textarea required maxLength={500} value={motivoFallo} onChange={(event) => setMotivoFallo(event.target.value)} className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white" />
                  </label>
                  <label className="block space-y-1.5 text-sm text-slate-300">Captura del error
                    <input required type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => setEvidenciaFallo(event.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200" />
                  </label>
                  <button type="submit" disabled={enviandoGarantia} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50">
                    {enviandoGarantia ? 'Enviando reporte...' : 'Enviar reporte de falla'}
                  </button>
                </form>
              </details>
            )}
            {mensajeWhatsApp && <a className="text-sm text-emerald-400 underline underline-offset-4" href={mensajeWhatsApp} target="_blank" rel="noreferrer">Abrir el mensaje de WhatsApp de nuevo</a>}
          </section>
        )}
      </div>

      {cantidadCarrito > 0 && !pasarelaAbierta && (
        <button type="button" onClick={abrirPasarela} className="fixed bottom-5 left-5 z-30 flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-950/30">
          <ShoppingCart size={20} /> Ver carrito · {cantidadCarrito} · S/ {totalCarrito.toFixed(2)} <span aria-hidden="true">→</span>
        </button>
      )}

      {pasarelaAbierta && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/85 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="public-checkout-title" className="mx-auto my-6 max-w-3xl overflow-hidden rounded-2xl border border-cyan-900 bg-slate-900 shadow-2xl">
            <header className="flex items-center justify-between gap-4 bg-gradient-to-r from-blue-950 to-purple-950 p-5">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-cyan-500/15 p-3 text-cyan-300"><ShoppingCart size={22} /></span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 id="public-checkout-title" className="text-lg font-semibold">Pasarela de Pagos Oficiales</h2>
                    <span className="rounded-full border border-emerald-800 bg-emerald-950/60 px-2 py-1 text-[10px] font-bold text-emerald-300">SSL SEGURO</span>
                  </div>
                  <p className="mt-1 text-sm text-cyan-200">Luigi Streaming Pro · Activación después de validar el pago</p>
                </div>
              </div>
              <button type="button" aria-label="Cerrar pasarela" onClick={() => setPasarelaAbierta(false)} className="rounded-lg bg-slate-950/60 p-2 text-slate-400 hover:text-white"><X size={20} /></button>
            </header>
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-3 text-xs">
              <span className="font-semibold text-cyan-300">✓ 1. Plan seleccionado</span>
              <span className="font-semibold text-cyan-300">2. Pasarela de pago</span>
              <span className="text-slate-500">3. Activación</span>
            </div>
            <div className="space-y-5 p-5">
              {error && <p role="alert" className="rounded-lg border border-red-900/70 bg-red-950/30 p-3 text-sm text-red-300">{error}</p>}
              {productosCarrito.length === 0 ? (
                <p className="rounded-lg border border-slate-800 p-5 text-sm text-slate-400">Tu carrito está vacío. Cierra esta ventana y añade un producto.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {productosCarrito.map((item) => (
                      <div key={item.servicioId} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <div className="min-w-40 flex-1">
                          <p className="font-semibold text-white">{item.nombre}</p>
                          <p className="mt-1 text-sm text-cyan-300">S/ {Number(item.precio).toFixed(2)} c/u</p>
                          {item.stockDisponible === 0 && <p className="mt-1 text-xs font-semibold text-amber-300">Sin stock · solicitud de reposición</p>}
                        </div>
                        <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950 px-2 py-1">
                          <button type="button" aria-label={`Quitar una unidad de ${item.nombre}`} onClick={() => cambiarCantidad(item, -1)} className="p-1 text-slate-400 hover:text-white"><Minus size={16} /></button>
                          <span className="min-w-5 text-center text-sm font-semibold">{carrito[item.servicioId]}</span>
                          <button type="button" aria-label={`Añadir una unidad de ${item.nombre}`} onClick={() => cambiarCantidad(item, 1)} disabled={cantidadCarrito >= 20 || (item.stockDisponible > 0 && (carrito[item.servicioId] ?? 0) >= item.stockDisponible)} className="p-1 text-slate-400 hover:text-white disabled:opacity-40"><Plus size={16} /></button>
                        </div>
                        <p className="w-24 text-right font-semibold text-white">S/ {(Number(item.precio) * (carrito[item.servicioId] ?? 0)).toFixed(2)}</p>
                        <button type="button" aria-label={`Eliminar ${item.nombre} del carrito`} onClick={() => cambiarCantidad(item, -(carrito[item.servicioId] ?? 0))} className="p-2 text-slate-500 hover:text-red-300"><Trash2 size={17} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-purple-900/70 bg-gradient-to-r from-slate-950 to-purple-950/40 p-5">
                    <div className="flex items-center justify-between text-sm text-slate-300"><span>Total de productos ({cantidadCarrito})</span><span>S/ {totalCarrito.toFixed(2)}</span></div>
                    <div className="mt-3 flex items-end justify-between border-t border-slate-800 pt-3"><span className="text-sm font-semibold text-slate-300">Total a pagar</span><strong className="text-2xl text-cyan-300">S/ {totalCarrito.toFixed(2)}</strong></div>
                  </div>
                  {productosSinStock.length > 0 ? (
                    <div className="space-y-3 rounded-xl border border-amber-800/70 bg-amber-950/20 p-5">
                      <p className="font-semibold text-amber-200">No se puede cobrar todavía: falta stock de algunos productos.</p>
                      <p className="text-sm text-slate-300">El catálogo sigue visible. Comunícate con el distribuidor para que solicite más cuentas al administrador.</p>
                      {productosSinStock.map((item) => (
                        <a
                          key={item.servicioId}
                          href={solicitarReposicion(item)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                          <ShoppingCart size={17} /> Solicitar {item.nombre} y avisar al distribuidor
                        </a>
                      ))}
                      <p className="text-xs text-slate-500">Los productos que sí tienen stock se pueden comprar al retirar los agotados del carrito.</p>
                    </div>
                  ) : (
                  <form onSubmit={enviarPedido} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-1.5 text-sm text-slate-300">Nombre completo
                        <input required maxLength={120} value={nombre} onChange={(event) => setNombre(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" placeholder="Tu nombre y apellido" />
                      </label>
                      <label className="block space-y-1.5 text-sm text-slate-300">WhatsApp o teléfono
                        <input required maxLength={20} value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" placeholder="+51 962 266 922" />
                      </label>
                    </div>
                    <PaymentInstructions metodo={metodoPago} onMetodoChange={setMetodoPago} />
                    <label className="block space-y-1.5 text-sm text-slate-300">Código de operación
                      <input required={metodoPago !== 'INTERNACIONAL'} maxLength={100} value={codigoOperacion} onChange={(event) => setCodigoOperacion(event.target.value)} placeholder={metodoPago === 'INTERNACIONAL' ? 'Código de transferencia o MTCN (si aplica)' : 'Número de operación'} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
                    </label>
                    <label className="block cursor-pointer space-y-2 rounded-xl border-2 border-dashed border-cyan-800 bg-slate-950/50 p-6 text-center text-sm text-slate-300">
                      <span className="block font-semibold text-white">{comprobante ? comprobante.name : 'Adjuntar captura de pago o transferencia'}</span>
                      <span className="block text-xs text-slate-500">Formatos JPG, PNG, WEBP o PDF · Máximo 5 MB</span>
                      <input required type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => setComprobante(event.target.files?.[0] ?? null)} className="mx-auto block max-w-full text-xs text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200" />
                    </label>
                    <p className="text-xs text-slate-500">El distribuidor recibirá tus datos y el comprobante para validar y despachar cada producto.</p>
                    <button type="submit" disabled={enviando} className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50">
                      {enviando ? 'Enviando pedido y comprobante...' : `Confirmar pago · S/ ${totalCarrito.toFixed(2)}`}
                    </button>
                  </form>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
