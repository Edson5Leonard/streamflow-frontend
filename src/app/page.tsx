'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { PaymentInstructions, type MetodoPago } from '@/components/payments/PaymentInstructions';
import { CredentialCard } from '@/components/client/CredentialCard';
import { Minus, Plus, ShoppingCart, Trash2, Upload, X, Zap } from 'lucide-react';

interface ServicioPublico {
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
  productos: ServicioPublico[];
}

interface TiendaDisponible {
  id: string;
  nombreTienda: string;
}

interface Solicitud {
  id: string;
  estado: string;
  monto: number;
  tokenPublico: string;
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
  compra: Compra | null;
}

export default function HomePage() {
  const router = useRouter();
  const [distribuidorId, setDistribuidorId] = useState('');
  const [tiendas, setTiendas] = useState<TiendaDisponible[]>([]);
  const [servicios, setServicios] = useState<ServicioPublico[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('YAPE');
  const [error, setError] = useState('');
  const [whatsappTienda, setWhatsappTienda] = useState<string | null>(null);
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [pasarelaAbierta, setPasarelaAbierta] = useState(false);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [codigoOperacion, setCodigoOperacion] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [enviandoPago, setEnviandoPago] = useState(false);
  const [pedidos, setPedidos] = useState<Solicitud[]>([]);
  const [seguimientos, setSeguimientos] = useState<Record<string, Seguimiento>>({});
  const [reclamoPedido, setReclamoPedido] = useState<Solicitud | null>(null);
  const [categoriaFallo, setCategoriaFallo] = useState('Contraseña incorrecta');
  const [motivoFallo, setMotivoFallo] = useState('');
  const [evidenciaFallo, setEvidenciaFallo] = useState<File | null>(null);
  const [enviandoReclamo, setEnviandoReclamo] = useState(false);
  const [mensajeReclamo, setMensajeReclamo] = useState('');
  const [enlaceWhatsApp, setEnlaceWhatsApp] = useState('');
  const productosCarrito = useMemo(
    () => servicios.filter((servicio) => (carrito[servicio.servicioId] ?? 0) > 0),
    [servicios, carrito],
  );
  const cantidadCarrito = Object.values(carrito).reduce((total, cantidad) => total + cantidad, 0);
  const totalCarrito = productosCarrito.reduce(
    (total, servicio) => total + Number(servicio.precio) * (carrito[servicio.servicioId] ?? 0),
    0,
  );
  const productosSinStock = productosCarrito.filter(
    (servicio) => (carrito[servicio.servicioId] ?? 0) > servicio.stockDisponible,
  );

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const tiendaElegida = params.get('distribuidorId');
    const pedidosGuardados = params.get('pedidos');
    if (pedidosGuardados) {
      try {
        const pedidosRestaurados = JSON.parse(pedidosGuardados) as Solicitud[];
        if (Array.isArray(pedidosRestaurados)) {
          Promise.resolve().then(() => setPedidos(pedidosRestaurados));
        }
      } catch {
        Promise.resolve().then(() => setError('No se pudo recuperar el seguimiento de tus pedidos.'));
      }
    }
    if (tiendaElegida) {
      Promise.resolve().then(() => {
        if (active) setDistribuidorId(tiendaElegida);
      });
    } else {
      void fetchApi<TiendaDisponible[]>('/tiendas/disponibles')
        .then((tiendasActivas) => {
          if (!active) return;
          setTiendas(tiendasActivas);
          if (tiendasActivas.length === 1) {
            setDistribuidorId(tiendasActivas[0].id);
            router.replace(`/?distribuidorId=${encodeURIComponent(tiendasActivas[0].id)}`);
          } else {
            setCargandoCatalogo(false);
          }
        })
        .catch((err: unknown) => {
          if (!active) return;
          setError(err instanceof Error ? err.message : 'No se pudieron cargar las tiendas disponibles.');
          setCargandoCatalogo(false);
        });
    }
    return () => { active = false; };
  }, [router]);

  useEffect(() => {
    if (!distribuidorId) return;
    let active = true;
    Promise.resolve()
      .then(() => fetchApi<CatalogoTienda>(`/tiendas/${encodeURIComponent(distribuidorId)}/catalogo`))
      .then((catalogo) => {
        if (!active) return;
        setServicios(catalogo.productos);
        setWhatsappTienda(catalogo.whatsapp);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'No se pudo cargar el catálogo.');
      })
      .finally(() => {
        if (active) setCargandoCatalogo(false);
      });
    return () => { active = false; };
  }, [distribuidorId]);

  useEffect(() => {
    if (pedidos.length === 0) return;
    let active = true;
    let timer: number | undefined;
    const consultar = async () => {
      try {
        const estados = await Promise.all(pedidos.map(async (pedido) => {
          const estado = await fetchApi<Seguimiento>(
            `/pagos/publico/${encodeURIComponent(pedido.id)}?token=${encodeURIComponent(pedido.tokenPublico)}`,
          );
          return [pedido.id, estado] as const;
        }));
        if (!active) return;
        setSeguimientos((actuales) => ({ ...actuales, ...Object.fromEntries(estados) }));
        if (estados.some(([, estado]) => estado.estado === 'PENDIENTE')) {
          timer = window.setTimeout(consultar, 5000);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudo consultar el pedido.');
        timer = window.setTimeout(consultar, 10000);
      }
    };
    void consultar();
    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [pedidos]);

  const enlaceAuth = (ruta: string) =>
    distribuidorId ? `${ruta}?distribuidorId=${encodeURIComponent(distribuidorId)}` : ruta;

  const handleSeleccionarTienda = (id: string) => {
    setError('');
    setDistribuidorId(id);
    setServicios([]);
    setCarrito({});
    setCargandoCatalogo(true);
    router.replace(`/?distribuidorId=${encodeURIComponent(id)}#catalogo`);
  };

  const irAComprar = (servicio: ServicioPublico, accion: 'pagar' | 'carrito') => {
    if (!distribuidorId) {
      setError('Selecciona una tienda disponible para continuar.');
      return;
    }
    setError('');
    const cantidadActual = carrito[servicio.servicioId] ?? 0;
    if (servicio.stockDisponible === 0) {
      setError(`${servicio.nombre} no tiene cuentas disponibles. Puedes avisar al distribuidor para que solicite reposición.`);
      return;
    }
    if (cantidadActual >= 20 || cantidadActual >= servicio.stockDisponible) {
      setError('No se pueden añadir más unidades: revisa el stock disponible.');
      return;
    }
    setCarrito((actual) => ({ ...actual, [servicio.servicioId]: (actual[servicio.servicioId] ?? 0) + 1 }));
    if (accion === 'pagar') setPasarelaAbierta(true);
  };

  const cambiarCantidad = (servicio: ServicioPublico, cambio: number) => {
    setCarrito((actual) => {
      const actualServicio = actual[servicio.servicioId] ?? 0;
      const nuevaCantidad = actualServicio + cambio;
      if (nuevaCantidad <= 0) {
        const siguiente = { ...actual };
        delete siguiente[servicio.servicioId];
        return siguiente;
      }
      const totalActual = Object.values(actual).reduce((total, cantidad) => total + cantidad, 0);
      if (cambio > 0 && totalActual >= 20) return actual;
      if (servicio.stockDisponible > 0 && nuevaCantidad > servicio.stockDisponible) return actual;
      return { ...actual, [servicio.servicioId]: nuevaCantidad };
    });
  };

  const solicitarReposicion = (servicio: ServicioPublico) => {
    const telefono = (whatsappTienda || '962266922').replace(/[^0-9]/g, '');
    const destino = telefono.startsWith('51') ? telefono : `51${telefono}`;
    const mensaje = `Hola, soy ${nombre || 'un cliente'}${whatsapp ? ` (${whatsapp})` : ''}. Quiero comprar ${servicio.nombre}, pero figura sin stock. ¿Podrían solicitar reposición y avisarme cuando esté disponible?`;
    return `https://wa.me/${destino}?text=${encodeURIComponent(mensaje)}`;
  };

  const enviarPago = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!distribuidorId || !comprobante || productosCarrito.length === 0) {
      setError('Completa tus datos, selecciona productos y adjunta el comprobante.');
      return;
    }
    if (productosSinStock.length > 0) {
      setError('Quita los productos sin stock antes de enviar el pago.');
      return;
    }

    const pestanaWhatsApp = window.open('about:blank', '_blank');
    setEnviandoPago(true);
    setError('');
    const formData = new FormData();
    formData.append('distribuidorId', distribuidorId);
    formData.append('nombreCompleto', nombre.trim());
    formData.append('whatsapp', whatsapp.trim());
    formData.append('metodoPago', metodoPago);
    if (codigoOperacion.trim()) formData.append('codigoOperacion', codigoOperacion.trim());
    formData.append('comprobante', comprobante);
    const productosSolicitados = productosCarrito.flatMap((servicio) =>
      Array.from({ length: carrito[servicio.servicioId] ?? 0 }, () => servicio),
    );
    productosSolicitados.forEach((servicio) => formData.append('servicioIds', servicio.servicioId));

    try {
      const respuesta = await fetchApi<Omit<Solicitud, 'servicioId' | 'nombreServicio'>[]>(
        '/pagos/solicitar-carrito',
        { method: 'POST', body: formData },
      );
      if (respuesta.length !== productosSolicitados.length) {
        throw new Error('El servidor no confirmó todos los productos. No se completó el pedido.');
      }
      const nuevasOrdenes = respuesta.map((solicitud, index) => ({
        ...solicitud,
        servicioId: productosSolicitados[index].servicioId,
        nombreServicio: productosSolicitados[index].nombre,
      }));
      setPedidos(nuevasOrdenes);
      setSeguimientos({});
      const totalConfirmado = respuesta.reduce((total, solicitud) => total + Number(solicitud.monto), 0);
      const detalle = productosSolicitados.map((servicio) => `• ${servicio.nombre} - S/ ${Number(servicio.precio).toFixed(2)}`).join('\n');
      const mensaje = `Hola, acabo de enviar mi pago por la Pasarela de Pagos Oficiales.\n\nORDEN: ${respuesta.map((solicitud) => solicitud.id).join(', ')}\nCLIENTE: ${nombre.trim()}\nTELÉFONO: ${whatsapp.trim()}\n\nDETALLES:\n${detalle}\n\nTOTAL: S/ ${totalConfirmado.toFixed(2)}\nMÉTODO: ${metodoPago}\nOPERACIÓN: ${codigoOperacion || 'No indicada'}\n\nEl comprobante ya fue adjuntado al pedido. Quedo atento a la validación y activación de mis cuentas.`;
      const destino = (whatsappTienda || '962266922').replace(/[^0-9]/g, '');
      const telefono = destino.startsWith('51') ? destino : `51${destino}`;
      const enlace = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
      setEnlaceWhatsApp(enlace);
      if (pestanaWhatsApp) pestanaWhatsApp.location.href = enlace;

      const params = new URLSearchParams();
      params.set('distribuidorId', distribuidorId);
      params.set('pedidos', JSON.stringify(nuevasOrdenes));
      window.history.replaceState(null, '', `/?${params.toString()}#seguimiento`);
      setCarrito({});
      setPasarelaAbierta(false);
      setCodigoOperacion('');
      setComprobante(null);
    } catch (err) {
      pestanaWhatsApp?.close();
      setError(err instanceof Error ? err.message : 'No se pudo enviar el pago. Inténtalo nuevamente.');
    } finally {
      setEnviandoPago(false);
    }
  };

  const enviarReclamo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reclamoPedido || !evidenciaFallo) {
      setError('Adjunta una captura del problema para enviar el reclamo.');
      return;
    }
    setEnviandoReclamo(true);
    setError('');
    setMensajeReclamo('');
    const formData = new FormData();
    formData.append('pagoId', reclamoPedido.id);
    formData.append('token', reclamoPedido.tokenPublico);
    formData.append('categoriaFallo', categoriaFallo);
    formData.append('motivo', motivoFallo);
    formData.append('archivo', evidenciaFallo);
    try {
      await fetchApi('/reclamos/publica', { method: 'POST', body: formData });
      setMensajeReclamo(`El reclamo de ${reclamoPedido.nombreServicio} se registró correctamente. Revisa tu WhatsApp para la respuesta.`);
      setReclamoPedido(null);
      setMotivoFallo('');
      setEvidenciaFallo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el reclamo.');
    } finally {
      setEnviandoReclamo(false);
    }
  };

  const serviciosVisibles = servicios;
  const categoriasVisibles = ['Todos', ...new Set(serviciosVisibles.map((servicio) => servicio.categoria))];
  const serviciosFiltrados = filtroCategoria === 'Todos'
    ? serviciosVisibles
    : serviciosVisibles.filter((servicio) => servicio.categoria === filtroCategoria);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-gray-950 to-gray-950 text-white font-sans flex flex-col justify-between selection:bg-purple-600 selection:text-white scroll-smooth">
      
      {/* 1. Barra de Promos Superior */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 py-2 px-4 text-center text-xs font-semibold tracking-wide text-purple-200 border-b border-purple-800/40">
        ✨ 🚀 ¡SUPER PROMO! Combos familiares y precios especiales de renovación disponibles hoy. PERÚ 🇵🇪
      </div>

      {/* 2. Navbar Principal Estilo Referencia */}
      <header className="border-b border-gray-800/80 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-purple-600/30">
              L
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight block text-white leading-tight">LUIGI STREAMING <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-600 text-white">PRO</span></span>
              <span className="text-[10px] text-gray-400">Cuentas Premium & Servicios Digitales</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-gray-300">
            <a href="#inicio" className="hover:text-purple-400 transition-colors">Inicio</a>
            <a href="#catalogo" className="hover:text-purple-400 transition-colors">Catálogo</a>
            <a href="#promociones" className="hover:text-purple-400 transition-colors">Promociones</a>
            <a href="#como-pagar" className="hover:text-purple-400 transition-colors">Cómo Pagar</a>
            <a href="#contacto" className="hover:text-purple-400 transition-colors">Contacto</a>
          </nav>

          <div className="flex items-center space-x-3">
            {cantidadCarrito > 0 && (
              <button
                type="button"
                onClick={() => setPasarelaAbierta(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-700 bg-cyan-950/60 px-4 py-2 text-xs font-bold text-cyan-200 transition hover:bg-cyan-900"
              >
                <ShoppingCart size={16} /> Carrito ({cantidadCarrito}) · S/ {totalCarrito.toFixed(2)}
              </button>
            )}
            <a
              href="https://wa.me/51962266922?text=Hola,%20deseo%20atención%20directa"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
            >
              <span>💬 WhatsApp Directo</span>
            </a>

            <Link
              href={enlaceAuth('/login')}
              className="text-xs font-bold bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 px-4 py-2.5 rounded-xl transition"
            >
              Propietario
            </Link>
          </div>

        </div>
      </header>

      {/* 3. INICIO (Hero Section) */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20 flex-grow">
        
        <section id="inicio" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-gray-900/80 border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/25">
              Plataforma Oficial de Streaming en Perú | 100% Garantizado
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
              LUIGI STREAMING PRO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">
                Tu entretenimiento favorito en un solo lugar
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Cuentas premium garantizadas, activación rápida en minutos y soporte personalizado para que disfrutes de tus series, películas y música sin interrupciones.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#catalogo"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-xl shadow-blue-600/30"
              >
                Ver catálogo
              </a>
              <a
                href="#como-pagar"
                className="px-6 py-3.5 bg-purple-900/60 hover:bg-purple-900 border border-purple-500/30 text-white font-bold text-xs rounded-xl transition"
              >
                Solicitar servicio
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800 text-xs text-gray-400">
              <div>⚡ <strong className="text-white block">5 - 15 MIN</strong> Activación rápida garantizada</div>
              <div>🛡️ <strong className="text-white block">30 DÍAS</strong> Garantía completa del mes</div>
              <div>💳 <strong className="text-white block">YAPE / PLIN</strong> Pago fácil sin tarjeta</div>
            </div>
          </div>

          {/* Tarjeta Visual Estilo Personaje */}
          <div className="bg-gray-950 border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-center space-y-4">
            <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600/20 text-purple-300 text-[10px] font-bold rounded border border-purple-500/30">
              # PERSONAJE OFICIAL
            </div>
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 p-1 shadow-xl flex items-center justify-center text-6xl">
              🎮
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Luigi Streaming Pro</h3>
              <p className="text-xs text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> En Línea
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-gray-900 rounded border border-gray-800">Netflix</span>
              <span className="px-2 py-1 bg-gray-900 rounded border border-gray-800">Disney+</span>
              <span className="px-2 py-1 bg-gray-900 rounded border border-gray-800">Max</span>
              <span className="px-2 py-1 bg-gray-900 rounded border border-gray-800">Spotify</span>
            </div>
          </div>
        </section>

        {/* 4. CATÁLOGO Y PROMOCIONES */}
        <section id="catalogo" className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800/80 pb-6">
            <div id="promociones">
              <span className="text-purple-400 font-extrabold text-xs uppercase tracking-widest">Planes & Combos</span>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">Catálogo de Servicios</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoriasVisibles.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltroCategoria(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filtroCategoria === cat
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {!distribuidorId && !cargandoCatalogo && tiendas.length > 1 && (
            <label className="block max-w-xl space-y-2 text-sm text-gray-300">
              <span>Elige una tienda para ver sus productos y comprar:</span>
              <select
                value=""
                onChange={(event) => handleSeleccionarTienda(event.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white"
              >
                <option value="" disabled>Selecciona un distribuidor</option>
                {tiendas.map((tienda) => (
                  <option key={tienda.id} value={tienda.id}>{tienda.nombreTienda}</option>
                ))}
              </select>
            </label>
          )}
          {!distribuidorId && !cargandoCatalogo && tiendas.length === 0 && (
            <p role="status" className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-400">
              {error || 'No hay tiendas activas en este momento.'}
            </p>
          )}
          {distribuidorId && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-400">Catálogo completo · el número indica las cuentas disponibles ahora.</p>
              {tiendas.length > 1 && (
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  Cambiar tienda
                  <select
                    value={distribuidorId}
                    onChange={(event) => handleSeleccionarTienda(event.target.value)}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                  >
                    {tiendas.map((tienda) => (
                      <option key={tienda.id} value={tienda.id}>{tienda.nombreTienda}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )}
          {distribuidorId && cargandoCatalogo && <p className="text-sm text-gray-400">Cargando catálogo de la tienda...</p>}
          {distribuidorId && !cargandoCatalogo && servicios.length === 0 && (
            <p role="status" className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-400">
              {error || 'No hay servicios disponibles en esta tienda.'}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviciosFiltrados.map((serv) => (
              <div
                key={serv.servicioId}
                className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/50 hover:bg-gray-900 transition-all duration-300 shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-4xl p-2 bg-gray-950/60 rounded-xl border border-gray-800 group-hover:scale-110 transition-transform inline-block">
                      📺
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {serv.stockDisponible} cuentas disponibles
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white group-hover:text-purple-400 transition-colors">
                      {serv.nombre}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {serv.descripcion}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase block">Precio</span>
                    <span className="text-xl font-black text-emerald-400">S/ {Number(serv.precio).toFixed(2)}</span>
                    <p className={`mt-1 text-xs ${serv.stockDisponible > 0 ? 'text-slate-500' : 'font-semibold text-amber-300'}`}>
                      {serv.stockDisponible > 0 ? 'Disponible para entrega' : 'Agotado · avisa al distribuidor'}
                    </p>
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <button
                      type="button"
                      disabled={!distribuidorId || serv.stockDisponible === 0}
                      onClick={() => irAComprar(serv, 'pagar')}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Zap size={17} /> Continuar al Pago <span aria-hidden="true">→</span>
                    </button>
                    <button
                      type="button"
                      disabled={!distribuidorId || serv.stockDisponible === 0}
                      onClick={() => irAComprar(serv, 'carrito')}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-cyan-700 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingCart size={17} /> Agregar al carrito
                    </button>
                    {serv.stockDisponible === 0 && distribuidorId && (
                      <a
                        href={solicitarReposicion(serv)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center rounded-xl border border-amber-800/70 bg-amber-950/30 px-4 py-2.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-950/60"
                      >
                        Avisar al distribuidor por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {pedidos.length > 0 && (
          <section id="seguimiento" className="space-y-5 rounded-3xl border border-cyan-900/60 bg-gray-900/80 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Pedido recibido</p>
                <h2 className="mt-1 text-2xl font-black text-white">Seguimiento y tus cuentas</h2>
                <p className="mt-1 text-sm text-slate-400">El distribuidor revisará el comprobante y aprobará cada servicio.</p>
              </div>
              {enlaceWhatsApp && (
                <a href={enlaceWhatsApp} target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">
                  Enviar mensaje por WhatsApp
                </a>
              )}
            </div>
            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800">
              {pedidos.map((pedido) => {
                const estado = seguimientos[pedido.id];
                return (
                  <article key={pedido.id} className="space-y-4 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-white">{pedido.nombreServicio}</p>
                        <p className="mt-1 text-xs text-slate-400">Orden {pedido.id} · S/ {Number(pedido.monto).toFixed(2)}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        estado?.estado === 'APROBADO' ? 'bg-emerald-950 text-emerald-300'
                          : estado?.estado === 'RECHAZADO' ? 'bg-red-950 text-red-300'
                            : 'bg-amber-950 text-amber-300'
                      }`}>{estado?.estado === 'APROBADO' ? 'Aprobado' : estado?.estado === 'RECHAZADO' ? 'Rechazado' : 'Validando pago'}</span>
                    </div>
                    {estado?.motivoRechazo && <p role="alert" className="text-sm text-red-300">Motivo: {estado.motivoRechazo}</p>}
                    {estado?.compra && (
                      <CredentialCard
                        servicio={estado.compra.servicio}
                        correo={estado.compra.correo}
                        password={estado.compra.password}
                        perfilPin={estado.compra.perfilPin}
                        fecha={estado.compra.fechaVenta}
                      />
                    )}
                    {estado?.estado === 'APROBADO' && estado.compra && !estado.garantiaUsada && (
                      <button
                        type="button"
                        onClick={() => { setReclamoPedido(pedido); setError(''); }}
                        className="rounded-lg border border-amber-700 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-950/60"
                      >
                        Reclamar / reportar problema con esta cuenta
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
            {mensajeReclamo && <p role="status" className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-4 text-sm text-emerald-300">{mensajeReclamo}</p>}
          </section>
        )}

        {/* 5. CÓMO PAGAR (Métodos de Pago Oficiales) */}
        <section id="como-pagar" className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 md:p-12 space-y-8 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="text-purple-400 font-extrabold text-xs uppercase tracking-widest">Pasarela de Pagos Segura</span>
            <h2 className="text-3xl font-black text-white">Métodos de Pago Oficiales</h2>
            <p className="text-gray-400 text-xs md:text-sm">Elige Yape, BCP, Interbank o transferencia internacional. El distribuidor valida el comprobante antes de activar el pedido.</p>
          </div>

          <div className="mx-auto max-w-3xl">
            <PaymentInstructions metodo={metodoPago} onMetodoChange={setMetodoPago} mostrarPlin={false} />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!distribuidorId) {
                  setError('Selecciona una tienda en el catálogo antes de continuar.');
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  return;
                }
                if (cantidadCarrito === 0) {
                  setError('Agrega al carrito al menos una cuenta disponible.');
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  return;
                }
                setError('');
                setPasarelaAbierta(true);
              }}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
            >
              Abrir pasarela de pago
            </button>
            <a
              href="https://wa.me/51962266922?text=Hola%2C%20quiero%20ayuda%20para%20realizar%20un%20pago"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-emerald-700 px-6 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-950/50"
            >
              Comunicarme por WhatsApp
            </a>
          </div>
        </section>

        {/* 6. CONTACTO */}
        <section id="contacto" className="bg-gradient-to-r from-purple-950/40 via-gray-900 to-gray-900 border border-purple-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-purple-400 font-extrabold text-xs uppercase tracking-widest">Atención Inmediata por WhatsApp</span>
            <h3 className="text-2xl md:text-3xl font-black text-white">¿Tienes dudas o deseas atención personalizada?</h3>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl">
              Contáctanos directamente. Te asesoramos con la plataforma perfecta para tus gustos, renovamos tus perfiles y activamos tu cuenta en contados minutos.
            </p>
          </div>
          <a
            href="https://wa.me/51962266922?text=Hola,%20deseo%20adquirir%20un%20servicio%20de%20Luigi%20Streaming%20Pro"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl transition shadow-xl shadow-emerald-600/30 flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            <span>💬 Chatear por WhatsApp Ahora</span>
          </a>
        </section>

      </main>

      {pasarelaAbierta && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !enviandoPago) setPasarelaAbierta(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pasarela-titulo"
            className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Checkout seguro</p>
                <h2 id="pasarela-titulo" className="mt-1 text-2xl font-black text-white">Pasarela de pagos oficiales</h2>
                <p className="mt-1 text-sm text-slate-400">Transfiere, adjunta tu comprobante y el distribuidor validará el pedido.</p>
              </div>
              <button
                type="button"
                aria-label="Cerrar pasarela de pago"
                disabled={enviandoPago}
                onClick={() => setPasarelaAbierta(false)}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {productosCarrito.length === 0 ? (
              <div className="mt-6 rounded-xl border border-amber-800 bg-amber-950/30 p-4 text-sm text-amber-200">
                Tu carrito está vacío. Agrega una cuenta disponible desde el catálogo.
              </div>
            ) : (
              <form onSubmit={enviarPago} className="mt-6 space-y-6">
                <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <h3 className="font-bold text-white">Resumen del carrito</h3>
                  {productosCarrito.map((servicio) => (
                    <div key={servicio.servicioId} className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
                      <div className="min-w-[140px] flex-1">
                        <p className="text-sm font-semibold text-white">{servicio.nombre}</p>
                        <p className="text-xs text-slate-400">S/ {Number(servicio.precio).toFixed(2)} c/u · {servicio.stockDisponible} disponibles</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label={`Quitar una unidad de ${servicio.nombre}`} onClick={() => cambiarCantidad(servicio, -1)} className="rounded-lg border border-slate-700 p-2 text-slate-200 hover:bg-slate-800"><Minus size={15} /></button>
                        <span className="min-w-6 text-center font-bold text-white">{carrito[servicio.servicioId]}</span>
                        <button type="button" aria-label={`Añadir una unidad de ${servicio.nombre}`} disabled={carrito[servicio.servicioId] >= servicio.stockDisponible || cantidadCarrito >= 20} onClick={() => cambiarCantidad(servicio, 1)} className="rounded-lg border border-slate-700 p-2 text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={15} /></button>
                        <button type="button" aria-label={`Eliminar ${servicio.nombre} del carrito`} onClick={() => setCarrito((actual) => { const siguiente = { ...actual }; delete siguiente[servicio.servicioId]; return siguiente; })} className="rounded-lg border border-red-900/60 p-2 text-red-300 hover:bg-red-950/60"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {productosSinStock.length > 0 && (
                    <p role="alert" className="text-sm text-red-300">El stock cambió para {productosSinStock.map((producto) => producto.nombre).join(', ')}. Ajusta las cantidades antes de pagar.</p>
                  )}
                  <div className="flex justify-between border-t border-slate-700 pt-3 text-base font-black text-white">
                    <span>Total</span><span>S/ {totalCarrito.toFixed(2)}</span>
                  </div>
                </div>

                <PaymentInstructions metodo={metodoPago} onMetodoChange={setMetodoPago} mostrarPlin={false} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm text-slate-300">
                    Nombre completo
                    <input required minLength={2} maxLength={120} autoComplete="name" value={nombre} onChange={(event) => setNombre(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white" placeholder="Tu nombre y apellido" />
                  </label>
                  <label className="space-y-1.5 text-sm text-slate-300">
                    WhatsApp
                    <input required minLength={9} maxLength={20} autoComplete="tel" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white" placeholder="Tu número de contacto" />
                  </label>
                  <label className="space-y-1.5 text-sm text-slate-300 sm:col-span-2">
                    Código de operación (si aplica)
                    <input maxLength={100} value={codigoOperacion} onChange={(event) => setCodigoOperacion(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white" placeholder="Número de operación o referencia" />
                  </label>
                  <label className="space-y-1.5 text-sm text-slate-300 sm:col-span-2">
                    Captura o archivo del comprobante
                    <span className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-600 bg-slate-900 px-4 py-4 text-sm text-slate-300 hover:border-cyan-600">
                      <Upload size={18} className="text-cyan-300" />
                      {comprobante ? comprobante.name : 'Selecciona una imagen o PDF'}
                      <input required type="file" accept="image/*,application/pdf" onChange={(event) => setComprobante(event.target.files?.[0] ?? null)} className="sr-only" />
                    </span>
                  </label>
                </div>

                {error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}
                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 pt-4">
                  <button type="button" disabled={enviandoPago} onClick={() => setPasarelaAbierta(false)} className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 disabled:opacity-50">Seguir comprando</button>
                  <button type="submit" disabled={enviandoPago || productosSinStock.length > 0 || !distribuidorId} className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50">
                    {enviandoPago ? 'Enviando comprobante...' : 'Enviar comprobante y pedido'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      {reclamoPedido && (
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !enviandoReclamo) setReclamoPedido(null); }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="reclamo-titulo" className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><h2 id="reclamo-titulo" className="text-xl font-black text-white">Reportar un problema</h2><p className="mt-1 text-sm text-slate-400">{reclamoPedido.nombreServicio} · adjunta evidencia para que el distribuidor revise tu caso.</p></div>
              <button type="button" aria-label="Cerrar reclamo" onClick={() => setReclamoPedido(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"><X size={18} /></button>
            </div>
            <form onSubmit={enviarReclamo} className="mt-5 space-y-4">
              <label className="block space-y-1.5 text-sm text-slate-300">Tipo de problema
                <select value={categoriaFallo} onChange={(event) => setCategoriaFallo(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white">
                  <option>Contraseña incorrecta</option><option>Cuenta no funciona</option><option>Perfil o PIN incorrecto</option><option>Otro</option>
                </select>
              </label>
              <label className="block space-y-1.5 text-sm text-slate-300">Descripción
                <textarea required minLength={5} maxLength={1000} value={motivoFallo} onChange={(event) => setMotivoFallo(event.target.value)} className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white" placeholder="Describe qué ocurrió" />
              </label>
              <label className="block space-y-1.5 text-sm text-slate-300">Captura del problema
                <input required type="file" accept="image/*,application/pdf" onChange={(event) => setEvidenciaFallo(event.target.files?.[0] ?? null)} className="block w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-white" />
              </label>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" disabled={enviandoReclamo} onClick={() => setReclamoPedido(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancelar</button>
                <button type="submit" disabled={enviandoReclamo} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{enviandoReclamo ? 'Enviando...' : 'Enviar reclamo'}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-gray-900/80 py-8 px-6 text-center text-xs text-gray-500 space-y-2">
        <p>© 2026 Luigi Streaming Pro. Pagos disponibles por Yape, Plin, BCP, Interbank y transferencias internacionales.</p>
      </footer>

    </div>
  );
}