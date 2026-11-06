'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchApi, fetchApiBlob } from '@/lib/api';
import { X } from 'lucide-react';

interface CuentaGlobal {
  id: string;
  servicioId: string;
  correo: string;
  password: string;
  perfilPin: string | null;
  precioVenta: number | null;
  estado: string;
}

interface Servicio {
  id: string;
  nombre: string;
  precioReposicion: number | null;
}

interface SolicitudReposicion {
  id: string;
  servicioId: string;
  nombreDistribuidor: string;
  nombreServicio: string;
  unidadesSolicitadas: number;
  precioPropuesto: number;
  montoCotizado: number;
  precioAcordado: number | null;
  metodoPago: 'YAPE' | 'PLIN' | 'BCP' | 'INTERBANK' | 'INTERNACIONAL' | null;
  codigoOperacion: string | null;
  comprobanteUrl: string | null;
  estado: 'SOLICITADA' | 'PAGO_PENDIENTE' | 'PAGO_APROBADO' | 'ATENDIDA' | 'RECHAZADA';
  notaAdmin: string | null;
  fechaCreacion: string;
}

interface ComprobanteVista {
  nombre: string;
  url: string;
  tipo: string;
}

interface CuentaGlobalEditForm {
  correo: string;
  password: string;
  perfil: string;
  pin: string;
}

export default function StockGlobalPage() {
  const [stock, setStock] = useState<CuentaGlobal[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [preciosReposicion, setPreciosReposicion] = useState<Record<string, string>>({});
  const [solicitudes, setSolicitudes] = useState<SolicitudReposicion[]>([]);
  const [comprobanteVista, setComprobanteVista] = useState<ComprobanteVista | null>(null);
  const [servicioId, setServicioId] = useState('');
  const [emailCuenta, setEmailCuenta] = useState('');
  const [passwordCuenta, setPasswordCuenta] = useState('');
  const [perfil, setPerfil] = useState('');
  const [pin, setPin] = useState('');
  const [cuentaEditandoId, setCuentaEditandoId] = useState<string | null>(null);
  const [cuentaEditForm, setCuentaEditForm] = useState<CuentaGlobalEditForm | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardandoPrecio, setGuardandoPrecio] = useState<string | null>(null);
  const [precioEditandoId, setPrecioEditandoId] = useState<string | null>(null);
  const [guardandoCuenta, setGuardandoCuenta] = useState(false);

  const cargarStock = useCallback(async () => {
    const [cuentasResultado, catalogoResultado, reposicionesResultado] = await Promise.allSettled([
      fetchApi<CuentaGlobal[]>('/cuentas/global'),
      fetchApi<Servicio[]>('/servicios/activos'),
      fetchApi<SolicitudReposicion[]>('/reposiciones'),
    ]);

    const errores: string[] = [];
    if (cuentasResultado.status === 'fulfilled') {
      setStock(cuentasResultado.value);
    } else {
      errores.push('No se pudo cargar el stock global.');
    }

    if (catalogoResultado.status === 'fulfilled') {
      setServicios(catalogoResultado.value);
      setPreciosReposicion((actuales) => Object.fromEntries(
        catalogoResultado.value.map((servicio) => [
          servicio.id,
          actuales[servicio.id] ?? (servicio.precioReposicion == null ? '' : String(servicio.precioReposicion)),
        ]),
      ));
      setServicioId((current) => current || catalogoResultado.value[0]?.id || '');
    } else {
      errores.push('No se pudo cargar el catálogo de servicios; no podrás seleccionar un servicio.');
    }

    if (reposicionesResultado.status === 'fulfilled') {
      setSolicitudes(reposicionesResultado.value);
    } else {
      errores.push('No se pudieron cargar las solicitudes de los distribuidores. Actualiza y reinicia el backend para habilitar el módulo de reposiciones.');
    }

    setError(errores.join(' '));
  }, []);

  const handleGuardarPrecioReposicion = async (servicio: Servicio) => {
    const precio = Number(preciosReposicion[servicio.id]);
    if (!Number.isFinite(precio) || precio <= 0) {
      setError('El precio de reposición debe ser mayor a cero.');
      return;
    }
    setError('');
    setGuardandoPrecio(servicio.id);
    try {
      const actualizado = await fetchApi<Servicio>(`/servicios/${servicio.id}/precio-reposicion`, {
        method: 'PATCH',
        body: JSON.stringify({ precioReposicion: precio }),
      });
      setServicios((actuales) => actuales.map((item) => item.id === actualizado.id ? actualizado : item));
      setPreciosReposicion((actuales) => ({ ...actuales, [servicio.id]: String(actualizado.precioReposicion) }));
      setPrecioEditandoId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el precio de reposición.');
    } finally {
      setGuardandoPrecio(null);
    }
  };

  const iniciarEdicionPrecio = (servicio: Servicio) => {
    setPreciosReposicion((actuales) => ({
      ...actuales,
      [servicio.id]: servicio.precioReposicion == null ? '' : String(servicio.precioReposicion),
    }));
    setPrecioEditandoId(servicio.id);
    setError('');
  };

  const cancelarEdicionPrecio = (servicio: Servicio) => {
    setPreciosReposicion((actuales) => ({
      ...actuales,
      [servicio.id]: servicio.precioReposicion == null ? '' : String(servicio.precioReposicion),
    }));
    setPrecioEditandoId(null);
    setError('');
  };

  useEffect(() => {
    Promise.resolve()
      .then(cargarStock)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar el stock global.'))
      .finally(() => setLoading(false));
  }, [cargarStock]);

  const handleAtenderReposicion = async (solicitud: SolicitudReposicion) => {
    setError('');
    try {
      await fetchApi(`/reposiciones/${solicitud.id}/atender`, {
        method: 'PATCH',
        body: JSON.stringify({
          nota: '',
        }),
      });
      await cargarStock();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo asignar el stock solicitado.');
    }
  };

  const handleVerComprobante = async (solicitud: SolicitudReposicion) => {
    setError('');
    try {
      const blob = await fetchApiBlob(`/reposiciones/${solicitud.id}/comprobante`);
      setComprobanteVista({
        nombre: `${solicitud.nombreServicio} · ${solicitud.nombreDistribuidor}`,
        url: URL.createObjectURL(blob),
        tipo: blob.type,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir el comprobante.');
    }
  };

  const cerrarComprobante = () => {
    if (comprobanteVista) URL.revokeObjectURL(comprobanteVista.url);
    setComprobanteVista(null);
  };

  const handleAprobarPago = async (solicitud: SolicitudReposicion) => {
    setError('');
    try {
      await fetchApi(`/reposiciones/${solicitud.id}/aprobar-pago`, { method: 'PATCH' });
      await cargarStock();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aprobar el comprobante.');
    }
  };

  const handleRechazarReposicion = async (id: string) => {
    setError('');
    try {
      await fetchApi(`/reposiciones/${id}/rechazar`, {
        method: 'PATCH',
        body: JSON.stringify({ nota: 'Solicitud rechazada por el administrador.' }),
      });
      await cargarStock();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo rechazar la solicitud.');
    }
  };

  const handleAgregarCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetchApi('/cuentas/global', {
        method: 'POST',
        body: JSON.stringify({
          servicioId,
          correo: emailCuenta,
          password: passwordCuenta,
          perfilPin: [perfil, pin].filter(Boolean).join('|') || null,
        }),
      });
      await cargarStock();
      setEmailCuenta('');
      setPasswordCuenta('');
      setPerfil('');
      setPin('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la cuenta global.');
    }
  };

  const handleEliminar = async (id: string) => {
    setError('');
    try {
      await fetchApi(`/cuentas/global/${id}`, { method: 'DELETE' });
      setStock((cuentas) => cuentas.filter((cuenta) => cuenta.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la cuenta.');
    }
  };

  const iniciarEdicionCuenta = (cuenta: CuentaGlobal) => {
    const [perfilActual = '', pinActual = ''] = cuenta.perfilPin?.split('|') ?? [];
    setCuentaEditandoId(cuenta.id);
    setCuentaEditForm({
      correo: cuenta.correo,
      password: cuenta.password,
      perfil: perfilActual,
      pin: pinActual,
    });
  };

  const handleGuardarEdicionCuenta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cuentaEditandoId || !cuentaEditForm) return;
    setError('');
    setGuardandoCuenta(true);
    try {
      const actualizada = await fetchApi<CuentaGlobal>(`/cuentas/global/${cuentaEditandoId}`, {
        method: 'PUT',
        body: JSON.stringify({
          correo: cuentaEditForm.correo.trim(),
          password: cuentaEditForm.password,
          perfilPin: [cuentaEditForm.perfil.trim(), cuentaEditForm.pin.trim()].filter(Boolean).join('|') || null,
        }),
      });
      setStock((cuentas) => cuentas.map((cuenta) => cuenta.id === actualizada.id ? actualizada : cuenta));
      setCuentaEditandoId(null);
      setCuentaEditForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la cuenta global.');
    } finally {
      setGuardandoCuenta(false);
    }
  };

  const stockGlobalDisponible = (id: string) =>
    stock.filter((cuenta) => cuenta.servicioId === id && cuenta.estado === 'DISPONIBLE').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Stock Global de Cuentas (Super Admin)</h1>
        <p className="text-gray-400 text-sm mt-1">
          Inventario global independiente del stock asignado a cada tienda.
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <section className="space-y-4 rounded-2xl border border-blue-900/70 bg-gray-900 p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-blue-300">Precio fijo por cuenta para distribuidores</h2>
            <p className="mt-1 text-sm text-gray-400">Estos son los precios que pagan los distribuidores. Se calcula la cotización automáticamente según la cantidad; solo el administrador puede editar las tarifas aquí.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {servicios.map((servicio) => {
            const precioConfigurado = servicio.precioReposicion != null && Number(servicio.precioReposicion) > 0;
            const editando = precioEditandoId === servicio.id;
            return (
              <div key={servicio.id} className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-800 bg-gray-950/60 p-4">
              <div className="min-w-[180px] flex-1">
                <p className="text-sm font-bold text-white">{servicio.nombre}</p>
                <label className="mt-2 block space-y-1 text-xs text-gray-400">Precio por cuenta (S/)
                  <input type="number" min="0.01" step="0.01" disabled={precioConfigurado && !editando} value={preciosReposicion[servicio.id] ?? ''} onChange={(event) => setPreciosReposicion((actuales) => ({ ...actuales, [servicio.id]: event.target.value }))} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-70" />
                </label>
              </div>
              {precioConfigurado && !editando ? (
                <button type="button" onClick={() => iniciarEdicionPrecio(servicio)} className="rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-bold text-blue-200 transition hover:bg-blue-950/60">
                  Editar precio
                </button>
              ) : (
                <div className="flex gap-2">
                  <button type="button" disabled={guardandoPrecio === servicio.id} onClick={() => void handleGuardarPrecioReposicion(servicio)} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-50">
                    {guardandoPrecio === servicio.id ? 'Guardando...' : 'Guardar precio'}
                  </button>
                  {editando && precioConfigurado && (
                    <button type="button" disabled={guardandoPrecio === servicio.id} onClick={() => cancelarEdicionPrecio(servicio)} className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-300 transition hover:bg-gray-800 disabled:opacity-50">
                      Cancelar
                    </button>
                  )}
                </div>
              )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-cyan-900/70 bg-gray-900 p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-cyan-300">Solicitudes de reposición de distribuidores</h2>
          <p className="mt-1 text-sm text-gray-400">Valida el comprobante y asigna cuentas globales. Si el stock no alcanza, cárgalo en este panel y luego completa la asignación.</p>
        </div>
        {solicitudes.length === 0 ? <p className="text-sm text-gray-400">No hay solicitudes de reposición.</p> : (
          <div className="space-y-3">
            {solicitudes.map((solicitud) => (
              <article key={solicitud.id} className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{solicitud.nombreServicio} · {solicitud.unidadesSolicitadas} cuenta(s)</p>
                    <p className="mt-1 text-sm text-gray-400">Distribuidor: {solicitud.nombreDistribuidor}</p>
                    <p className="text-xs text-gray-500">Cotizado S/ {Number(solicitud.precioPropuesto).toFixed(2)} por cuenta · total S/ {Number(solicitud.montoCotizado ?? solicitud.precioPropuesto * solicitud.unidadesSolicitadas).toFixed(2)} · {new Date(solicitud.fechaCreacion).toLocaleDateString()}</p>
                    <p className={`mt-1 text-xs font-semibold ${stockGlobalDisponible(solicitud.servicioId) >= solicitud.unidadesSolicitadas ? 'text-emerald-300' : 'text-amber-300'}`}>
                      Stock global: {stockGlobalDisponible(solicitud.servicioId)} disponible(s) de {solicitud.unidadesSolicitadas} solicitado(s)
                    </p>
                    {solicitud.metodoPago && <p className="mt-1 text-xs text-gray-300">Pago: {solicitud.metodoPago} · Operación: {solicitud.codigoOperacion || 'No indicada'}</p>}
                    {solicitud.notaAdmin && <p className="mt-2 text-sm text-gray-300">{solicitud.notaAdmin}</p>}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${solicitud.estado === 'ATENDIDA' ? 'bg-emerald-950 text-emerald-300' : solicitud.estado === 'RECHAZADA' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'}`}>
                    {solicitud.estado === 'ATENDIDA' ? `Asignada · S/ ${Number(solicitud.precioAcordado).toFixed(2)}` : solicitud.estado === 'RECHAZADA' ? 'Rechazada' : solicitud.estado === 'PAGO_APROBADO' ? 'Pago aprobado · pendiente de stock' : solicitud.estado === 'PAGO_PENDIENTE' ? 'Comprobante por validar' : 'Esperando pago del distribuidor'}
                  </span>
                </div>
                {solicitud.estado === 'PAGO_PENDIENTE' && (
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <button type="button" onClick={() => void handleVerComprobante(solicitud)} className="rounded-lg border border-cyan-800 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-950/50">Ver comprobante</button>
                    <button type="button" onClick={() => void handleAprobarPago(solicitud)} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600">Validar pago</button>
                    <button type="button" onClick={() => void handleRechazarReposicion(solicitud.id)} className="rounded-lg border border-red-800 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-950/50">Rechazar pago</button>
                  </div>
                )}
                {solicitud.estado === 'PAGO_APROBADO' && (
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    {stockGlobalDisponible(solicitud.servicioId) < solicitud.unidadesSolicitadas && (
                      <a href="#cargar-stock-global" className="rounded-lg border border-amber-700 px-4 py-2.5 text-sm font-semibold text-amber-200 hover:bg-amber-950/50">
                        Cargar stock de {solicitud.nombreServicio}
                      </a>
                    )}
                    <button
                      type="button"
                      disabled={stockGlobalDisponible(solicitud.servicioId) < solicitud.unidadesSolicitadas}
                      onClick={() => void handleAtenderReposicion(solicitud)}
                      className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >Asignar {solicitud.unidadesSolicitadas} cuenta(s)</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {comprobanteVista && (
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) cerrarComprobante(); }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="comprobante-reposicion-titulo" className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="comprobante-reposicion-titulo" className="font-bold text-white">Comprobante · {comprobanteVista.nombre}</h2>
              <button type="button" aria-label="Cerrar comprobante" onClick={cerrarComprobante} className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800"><X size={18} /></button>
            </div>
            {comprobanteVista.tipo.startsWith('image/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={comprobanteVista.url} alt={`Comprobante de ${comprobanteVista.nombre}`} className="max-h-[75vh] w-full rounded-lg bg-white object-contain" />
            ) : (
              <iframe title={`Comprobante de ${comprobanteVista.nombre}`} src={comprobanteVista.url} className="h-[75vh] w-full rounded-lg bg-white" />
            )}
          </section>
        </div>
      )}

      {/* Formulario para cargar stock */}
      <form id="cargar-stock-global" onSubmit={handleAgregarCuenta} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-blue-400">Cargar Nueva Cuenta al Inventario Global</h2>
          <p className="mt-1 text-sm text-gray-400">Registra las credenciales de una cuenta real. El precio al distribuidor se configura por plataforma en la sección superior, no por cuenta.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Plataforma</label>
            <select
              value={servicioId}
              onChange={(e) => setServicioId(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              {servicios.map((servicio) => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Correo Cuenta Madre</label>
            <input
              type="email"
              placeholder="cuenta@correo.com"
              maxLength={150}
              value={emailCuenta}
              onChange={(e) => setEmailCuenta(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Contraseña</label>
            <input
              type="text"
              placeholder="••••••••"
              maxLength={100}
              value={passwordCuenta}
              onChange={(e) => setPasswordCuenta(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Perfil (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: Perfil 1"
              maxLength={15}
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">PIN (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: 1234"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={loading || servicios.length === 0}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          {loading ? 'Cargando...' : 'Guardar en Stock Global'}
        </button>
      </form>

      {/* Tabla de Stock Global */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-white">Cuentas registradas · {stock.length} total / {stock.filter((cuenta) => cuenta.estado === 'DISPONIBLE').length} disponibles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Servicio</th>
                <th className="p-4">Correo / Clave</th>
                <th className="p-4">Perfil / PIN</th>
                <th className="p-4">Precio fijo al distribuidor</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {stock.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-sm text-amber-200">No hay cuentas en el stock global. Carga cuentas arriba para poder atender solicitudes.</td></tr>
              )}
              {stock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/40 transition">
                  <td className="p-4 font-bold text-white">{servicios.find((servicio) => servicio.id === item.servicioId)?.nombre ?? 'Servicio'}</td>
                  {cuentaEditandoId === item.id && cuentaEditForm ? (
                    <>
                      <td className="p-2">
                        <form id={`editar-stock-global-${item.id}`} onSubmit={handleGuardarEdicionCuenta} className="space-y-2">
                          <input aria-label="Correo de la cuenta global" type="email" required maxLength={150} value={cuentaEditForm.correo} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, correo: event.target.value })} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                          <input aria-label="Contraseña de la cuenta global" type="text" required maxLength={100} value={cuentaEditForm.password} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, password: event.target.value })} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                        </form>
                      </td>
                      <td className="p-2">
                        <div className="space-y-2">
                          <input form={`editar-stock-global-${item.id}`} aria-label="Perfil de cuenta global" placeholder="Perfil" maxLength={15} value={cuentaEditForm.perfil} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, perfil: event.target.value })} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                          <input form={`editar-stock-global-${item.id}`} aria-label="PIN de cuenta global" placeholder="PIN" maxLength={4} value={cuentaEditForm.pin} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, pin: event.target.value })} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4">
                        <p className="font-mono text-xs text-blue-400">{item.correo}</p>
                        <p className="font-mono text-xs text-gray-500">{item.password}</p>
                      </td>
                      <td className="p-4 text-xs">{item.perfilPin ?? 'Cuenta completa'}</td>
                    </>
                  )}
                  <td className="p-4 font-bold text-green-400">
                    S/ {Number(servicios.find((servicio) => servicio.id === item.servicioId)?.precioReposicion ?? 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        item.estado === 'DISPONIBLE'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {cuentaEditandoId === item.id ? (
                      <div className="flex justify-end gap-2">
                        <button type="submit" form={`editar-stock-global-${item.id}`} disabled={guardandoCuenta} className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 disabled:opacity-50">
                          {guardandoCuenta ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" onClick={() => { setCuentaEditandoId(null); setCuentaEditForm(null); }} className="rounded-lg border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-300">Cancelar</button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button type="button" disabled={item.estado !== 'DISPONIBLE'} onClick={() => iniciarEdicionCuenta(item)} className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40">
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(item.id)}
                          className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition border border-red-500/20"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}