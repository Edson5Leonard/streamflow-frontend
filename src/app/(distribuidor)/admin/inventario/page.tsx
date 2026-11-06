'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { PaymentInstructions, type MetodoPago } from '@/components/payments/PaymentInstructions';
import { X } from 'lucide-react';

interface CuentaDistribuidor {
  id: string;
  servicioId: string;
  correo: string;
  password: string;
  perfilPin: string | null;
  precioVenta: number | null;
  estado: 'DISPONIBLE' | 'VENDIDO';
}

interface Servicio {
  id: string;
  nombre: string;
  precioReposicion: number | null;
}

interface SolicitudReposicion {
  id: string;
  servicioId: string;
  nombreServicio: string;
  unidadesSolicitadas: number;
  precioPropuesto: number;
  montoCotizado: number;
  precioAcordado: number | null;
  metodoPago: MetodoPago | null;
  codigoOperacion: string | null;
  comprobanteUrl: string | null;
  estado: 'SOLICITADA' | 'PAGO_PENDIENTE' | 'PAGO_APROBADO' | 'ATENDIDA' | 'RECHAZADA';
  notaAdmin: string | null;
  fechaCreacion: string;
}

interface CuentaEditForm {
  correo: string;
  password: string;
  perfil: string;
  pin: string;
  precioVenta: string;
}

export default function InventarioDistribuidorPage() {
  const [inventario, setInventario] = useState<CuentaDistribuidor[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudReposicion[]>([]);
  const [servicioId, setServicioId] = useState('');
  const [unidadesReposicion, setUnidadesReposicion] = useState('1');
  const [solicitudPago, setSolicitudPago] = useState<SolicitudReposicion | null>(null);
  const [metodoPagoReposicion, setMetodoPagoReposicion] = useState<MetodoPago>('YAPE');
  const [codigoOperacionReposicion, setCodigoOperacionReposicion] = useState('');
  const [comprobanteReposicion, setComprobanteReposicion] = useState<File | null>(null);
  const [emailCuenta, setEmailCuenta] = useState('');
  const [passwordCuenta, setPasswordCuenta] = useState('');
  const [perfil, setPerfil] = useState('');
  const [pin, setPin] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [cuentaEditandoId, setCuentaEditandoId] = useState<string | null>(null);
  const [cuentaEditForm, setCuentaEditForm] = useState<CuentaEditForm | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false);
  const [guardandoCuenta, setGuardandoCuenta] = useState(false);

  const cargarInventario = useCallback(async () => {
    const [cuentasResultado, catalogoResultado, reposicionesResultado] = await Promise.allSettled([
      fetchApi<CuentaDistribuidor[]>('/cuentas'),
      fetchApi<Servicio[]>('/servicios/activos'),
      fetchApi<SolicitudReposicion[]>('/reposiciones/mias'),
    ]);
    const errores: string[] = [];

    if (cuentasResultado.status === 'fulfilled') {
      setInventario(cuentasResultado.value);
    } else {
      errores.push('No se pudo cargar el inventario de cuentas.');
    }

    if (catalogoResultado.status === 'fulfilled') {
      setServicios(catalogoResultado.value);
      setServicioId((current) => current || catalogoResultado.value[0]?.id || '');
    } else {
      errores.push('No se pudo cargar el catálogo de servicios; no podrás seleccionar un servicio.');
    }

    if (reposicionesResultado.status === 'fulfilled') {
      setSolicitudes(reposicionesResultado.value);
    } else {
      errores.push('No se pudieron cargar tus solicitudes. Actualiza y reinicia el backend para habilitar el módulo de reposiciones.');
    }

    setError(errores.join(' '));
  }, []);

  useEffect(() => {
    Promise.resolve()
      .then(cargarInventario)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar el inventario.'))
      .finally(() => setLoading(false));
  }, [cargarInventario]);

  const handleSolicitarReposicion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviandoSolicitud(true);
    try {
      const solicitud = await fetchApi<SolicitudReposicion>('/reposiciones', {
        method: 'POST',
        body: JSON.stringify({
          servicioId,
          unidades: Number(unidadesReposicion),
        }),
      });
      setUnidadesReposicion('1');
      await cargarInventario();
      setSolicitudPago(solicitud);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la solicitud de reposición.');
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  const handleEnviarPagoReposicion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!solicitudPago || !comprobanteReposicion) {
      setError('Adjunta el comprobante para continuar.');
      return;
    }
    setError('');
    setEnviandoSolicitud(true);
    const formData = new FormData();
    formData.append('metodoPago', metodoPagoReposicion);
    formData.append('codigoOperacion', codigoOperacionReposicion.trim());
    formData.append('comprobante', comprobanteReposicion);
    try {
      await fetchApi<SolicitudReposicion>(`/reposiciones/${solicitudPago.id}/pago`, {
        method: 'POST',
        body: formData,
      });
      setSolicitudPago(null);
      setCodigoOperacionReposicion('');
      setComprobanteReposicion(null);
      await cargarInventario();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el comprobante del pago.');
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  const agotados = servicios.filter(
    (servicio) => inventario.filter((cuenta) => cuenta.servicioId === servicio.id && cuenta.estado === 'DISPONIBLE').length === 0,
  );
  const servicioReposicionSeleccionado = servicios.find((servicio) => servicio.id === servicioId);
  const precioReposicion = Number(servicioReposicionSeleccionado?.precioReposicion ?? 0);
  const totalReposicion = Math.max(0, Number(unidadesReposicion) || 0) * precioReposicion;

  const handleSubirStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetchApi('/cuentas', {
        method: 'POST',
        body: JSON.stringify({
          servicioId,
          correo: emailCuenta,
          password: passwordCuenta,
          perfilPin: [perfil, pin].filter(Boolean).join('|') || null,
          precioVenta: Number(precioVenta),
        }),
      });
      await cargarInventario();
      setEmailCuenta('');
      setPasswordCuenta('');
      setPerfil('');
      setPin('');
      setPrecioVenta('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la cuenta.');
    }
  };

  const handleEliminar = async (id: string) => {
    setError('');
    try {
      await fetchApi(`/cuentas/${id}`, { method: 'DELETE' });
      setInventario((cuentas) => cuentas.filter((cuenta) => cuenta.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la cuenta.');
    }
  };

  const iniciarEdicionCuenta = (cuenta: CuentaDistribuidor) => {
    const [perfilActual = '', pinActual = ''] = cuenta.perfilPin?.split('|') ?? [];
    setCuentaEditandoId(cuenta.id);
    setCuentaEditForm({
      correo: cuenta.correo,
      password: cuenta.password,
      perfil: perfilActual,
      pin: pinActual,
      precioVenta: String(cuenta.precioVenta ?? ''),
    });
  };

  const handleGuardarEdicionCuenta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cuentaEditandoId || !cuentaEditForm) return;
    setError('');
    setGuardandoCuenta(true);
    try {
      const actualizada = await fetchApi<CuentaDistribuidor>(`/cuentas/${cuentaEditandoId}`, {
        method: 'PUT',
        body: JSON.stringify({
          correo: cuentaEditForm.correo.trim(),
          password: cuentaEditForm.password,
          perfilPin: [cuentaEditForm.perfil.trim(), cuentaEditForm.pin.trim()].filter(Boolean).join('|') || null,
          precioVenta: Number(cuentaEditForm.precioVenta),
        }),
      });
      setInventario((cuentas) => cuentas.map((cuenta) => cuenta.id === actualizada.id ? actualizada : cuenta));
      setCuentaEditandoId(null);
      setCuentaEditForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la cuenta.');
    } finally {
      setGuardandoCuenta(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Inventario de Cuentas (Distribuidor)</h1>
        <p className="text-gray-400 text-sm mt-1">Carga tu stock diario para que tus clientes puedan canjear al instante.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      {agotados.length > 0 && (
        <section className="rounded-2xl border border-amber-700/60 bg-amber-950/30 p-5">
          <h2 className="font-bold text-amber-200">Servicios sin cuentas disponibles</h2>
          <p className="mt-1 text-sm text-amber-100/70">Solicita reposición al administrador para volver a habilitar las ventas:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {agotados.map((servicio) => (
              <span key={servicio.id} className="rounded-lg border border-amber-800/60 px-3 py-1.5 text-xs text-amber-100">
                {servicio.nombre} · 0 disponibles
              </span>
            ))}
          </div>
        </section>
      )}

      <form id="solicitar-reposicion" onSubmit={handleSolicitarReposicion} className="space-y-4 rounded-2xl border border-cyan-900/70 bg-gray-900 p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-cyan-300">Solicitar cuentas al administrador</h2>
          <p className="mt-1 text-sm text-gray-400">El administrador asignará las cuentas desde el stock global al precio acordado.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1 text-xs font-semibold text-gray-300">Servicio
            <select required value={servicioId} onChange={(e) => setServicioId(e.target.value)} className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-white">
              {servicios.map((servicio) => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-xs font-semibold text-gray-300">Cantidad
            <input required type="number" min="1" max="500" value={unidadesReposicion} onChange={(e) => setUnidadesReposicion(e.target.value)} className="w-full rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-white" />
          </label>
          <div className="space-y-1 text-xs font-semibold text-gray-300">
            Precio fijado por el administrador
            <p className="rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-white">
              {precioReposicion > 0 ? `S/ ${precioReposicion.toFixed(2)} por cuenta` : 'El administrador aún no configuró este precio'}
            </p>
          </div>
        </div>
        <p className="text-sm font-bold text-white">
          Cotización total: S/ {totalReposicion.toFixed(2)}
        </p>
        <button type="submit" disabled={loading || enviandoSolicitud || !servicioId || precioReposicion <= 0} className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-600 disabled:opacity-50">
          {enviandoSolicitud ? 'Preparando pasarela...' : 'Continuar a la pasarela de pago'}
        </button>
      </form>

      <section className="space-y-3 rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="font-bold text-white">Mis solicitudes de reposición</h2>
        {solicitudes.length === 0 ? <p className="text-sm text-gray-400">Aún no has solicitado cuentas.</p> : (
          <div className="space-y-2">
            {solicitudes.map((solicitud) => (
              <article key={solicitud.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                <div>
                  <p className="font-semibold text-white">{solicitud.nombreServicio} · {solicitud.unidadesSolicitadas} cuenta(s)</p>
                  <p className="mt-1 text-xs text-gray-400">Propuesta S/ {Number(solicitud.precioPropuesto).toFixed(2)} por cuenta · {new Date(solicitud.fechaCreacion).toLocaleDateString()}</p>
                  <p className="mt-1 text-sm font-bold text-cyan-300">Total cotizado: S/ {Number(solicitud.montoCotizado ?? solicitud.precioPropuesto * solicitud.unidadesSolicitadas).toFixed(2)}</p>
                  {solicitud.notaAdmin && <p className="mt-1 text-xs text-gray-300">{solicitud.notaAdmin}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${solicitud.estado === 'ATENDIDA' ? 'bg-emerald-950 text-emerald-300' : solicitud.estado === 'RECHAZADA' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'}`}>
                  {solicitud.estado === 'ATENDIDA' ? `Asignada · S/ ${Number(solicitud.precioAcordado).toFixed(2)}` : solicitud.estado === 'RECHAZADA' ? 'Rechazada' : solicitud.estado === 'SOLICITADA' ? 'Falta enviar pago' : solicitud.estado === 'PAGO_PENDIENTE' ? 'Validando pago' : 'Pago aprobado · preparando stock'}
                </span>
                {solicitud.estado === 'SOLICITADA' && (
                  <button type="button" onClick={() => { setError(''); setSolicitudPago(solicitud); }} className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-600">
                    Continuar al pago
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {solicitudPago && (
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !enviandoSolicitud) setSolicitudPago(null); }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 sm:p-6">
          <section role="dialog" aria-modal="true" aria-labelledby="reposicion-pago-titulo" className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Reposición de inventario</p>
                <h2 id="reposicion-pago-titulo" className="mt-1 text-2xl font-black text-white">Pasarela de pago</h2>
                <p className="mt-2 text-sm text-slate-300">{solicitudPago.nombreServicio} · {solicitudPago.unidadesSolicitadas} cuenta(s)</p>
                <p className="text-xl font-black text-emerald-300">Total: S/ {Number(solicitudPago.montoCotizado ?? solicitudPago.precioPropuesto * solicitudPago.unidadesSolicitadas).toFixed(2)}</p>
              </div>
              <button type="button" aria-label="Cerrar pasarela de pago" disabled={enviandoSolicitud} onClick={() => setSolicitudPago(null)} className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-50"><X size={18} /></button>
            </div>
            <form onSubmit={handleEnviarPagoReposicion} className="mt-5 space-y-5">
              <PaymentInstructions metodo={metodoPagoReposicion} onMetodoChange={setMetodoPagoReposicion} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm text-slate-300 sm:col-span-2">Código de operación
                  <input required={metodoPagoReposicion !== 'INTERNACIONAL'} maxLength={100} value={codigoOperacionReposicion} onChange={(event) => setCodigoOperacionReposicion(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white" placeholder="Número de operación o referencia" />
                </label>
                <label className="space-y-1.5 text-sm text-slate-300 sm:col-span-2">Comprobante de pago
                  <input required type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => setComprobanteReposicion(event.target.files?.[0] ?? null)} className="block w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-white" />
                  <span className="block text-xs text-slate-500">PNG, JPG, WEBP o PDF · máximo 5 MB</span>
                </label>
              </div>
              {error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button type="button" disabled={enviandoSolicitud} onClick={() => setSolicitudPago(null)} className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900">Pagar más tarde</button>
                <button type="submit" disabled={enviandoSolicitud || !comprobanteReposicion} className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50">{enviandoSolicitud ? 'Enviando comprobante...' : 'Enviar comprobante al administrador'}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      <form onSubmit={handleSubirStock} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-amber-400">Agregar Nueva Cuenta al Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Plataforma</label>
            <select
              value={servicioId}
              onChange={(e) => setServicioId(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            >
              {servicios.map((servicio) => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Correo de la Cuenta</label>
            <input
              type="email"
              placeholder="correo@streaming.com"
              maxLength={150}
              value={emailCuenta}
              onChange={(e) => setEmailCuenta(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
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
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Perfil (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: Perfil 3"
              maxLength={15}
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">PIN (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: 5555"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Precio Final al Comprador (S/)</label>
            <input
              type="number"
              step="0.50"
              min="0.01"
              placeholder="12.00"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              required
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || servicios.length === 0}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
        >
          {loading ? 'Cargando...' : 'Guardar en Inventario'}
        </button>
      </form>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
            <tr>
              <th className="p-4">Servicio</th>
              <th className="p-4">Credenciales</th>
              <th className="p-4">Perfil / PIN</th>
              <th className="p-4">Precio Venta</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {inventario.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800/40 transition">
                <td className="p-4 font-bold text-white">{servicios.find((servicio) => servicio.id === item.servicioId)?.nombre ?? 'Servicio'}</td>
                {cuentaEditandoId === item.id && cuentaEditForm ? (
                  <>
                    <td className="p-2">
                      <form id={`editar-cuenta-${item.id}`} onSubmit={handleGuardarEdicionCuenta} className="space-y-2">
                        <input aria-label="Correo de la cuenta" type="email" required maxLength={150} value={cuentaEditForm.correo} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, correo: event.target.value })} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                        <input aria-label="Contraseña de la cuenta" type="text" required maxLength={100} value={cuentaEditForm.password} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, password: event.target.value })} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                      </form>
                    </td>
                    <td className="p-2">
                      <div className="space-y-2">
                        <input form={`editar-cuenta-${item.id}`} aria-label="Perfil" placeholder="Perfil" maxLength={15} value={cuentaEditForm.perfil} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, perfil: event.target.value })} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                        <input form={`editar-cuenta-${item.id}`} aria-label="PIN" placeholder="PIN" maxLength={4} value={cuentaEditForm.pin} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, pin: event.target.value })} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                      </div>
                    </td>
                    <td className="p-2">
                      <input form={`editar-cuenta-${item.id}`} aria-label="Precio de venta" type="number" step="0.01" min="0.01" required value={cuentaEditForm.precioVenta} onChange={(event) => setCuentaEditForm({ ...cuentaEditForm, precioVenta: event.target.value })} className="w-24 rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-xs text-white" />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 text-xs font-mono">
                      <p className="text-amber-400">{item.correo}</p>
                      <p className="text-gray-500">{item.password}</p>
                    </td>
                    <td className="p-4 text-xs">{item.perfilPin?.replace('|', ' (PIN: ') ?? 'General'}{item.perfilPin?.includes('|') ? ')' : ''}</td>
                    <td className="p-4 font-bold text-green-400">S/ {Number(item.precioVenta ?? 0).toFixed(2)}</td>
                  </>
                )}
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                      item.estado === 'DISPONIBLE'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}
                  >
                    {item.estado}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {cuentaEditandoId === item.id ? (
                    <div className="flex justify-end gap-2">
                      <button type="submit" form={`editar-cuenta-${item.id}`} disabled={guardandoCuenta} className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 disabled:opacity-50">
                        {guardandoCuenta ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button type="button" onClick={() => { setCuentaEditandoId(null); setCuentaEditForm(null); }} className="rounded-lg border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-300">Cancelar</button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      {item.estado === 'DISPONIBLE' && (
                        <button type="button" onClick={() => iniciarEdicionCuenta(item)} className="rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                          Editar
                        </button>
                      )}
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
  );
}