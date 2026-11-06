'use client';

import { useEffect, useState } from 'react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ReceiptViewerModal } from '@/components/ui/ReceiptViewerModal';
import { fetchApi, fetchApiBlob } from '@/lib/api';

interface Reclamo {
  id: string;
  usuarioId: string;
  ventaId: string;
  categoriaFallo: string;
  motivo: string;
  comprobanteFalloUrl: string;
  correoAfectado: string;
  servicio: string;
  cuentaDefectuosaId: string;
  estado: string;
}

interface CuentaReemplazo {
  id: string;
  correo: string;
  tipoStock: string;
}

type Accion = 'descartar' | 'recuperar' | 'reemplazar';

export default function AuditoriaPage() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [seleccionado, setSeleccionado] = useState<{ reclamo: Reclamo; accion: Accion } | null>(null);
  const [clave, setClave] = useState('');
  const [cargando, setCargando] = useState(false);
  const [cargandoReemplazos, setCargandoReemplazos] = useState(false);
  const [cuentasReemplazo, setCuentasReemplazo] = useState<CuentaReemplazo[]>([]);
  const [cuentaReemplazoId, setCuentaReemplazoId] = useState('');
  const [error, setError] = useState('');
  const [evidencia, setEvidencia] = useState<{ url: string; mimeType: string } | null>(null);

  const cargar = async () => {
    setReclamos(await fetchApi<Reclamo[]>('/reclamos/observados'));
  };

  useEffect(() => {
    Promise.resolve().then(cargar).catch((err: unknown) =>
      setError(err instanceof Error ? err.message : 'No se pudo cargar la auditoría.'));
  }, []);

  const abrirEvidencia = async (reclamo: Reclamo) => {
    try {
      const nombre = reclamo.comprobanteFalloUrl.split('/').pop();
      if (!nombre) throw new Error('La evidencia no tiene una ruta válida.');
      const blob = await fetchApiBlob(`/reclamos/comprobantes/${encodeURIComponent(nombre)}`);
      setEvidencia({ url: URL.createObjectURL(blob), mimeType: blob.type });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir la evidencia.');
    }
  };

  useEffect(() => {
    return () => {
      if (evidencia) URL.revokeObjectURL(evidencia.url);
    };
  }, [evidencia]);

  const confirmar = async () => {
    if (!seleccionado) return;
    if (seleccionado.accion === 'recuperar' && clave.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (seleccionado.accion === 'reemplazar' && !cuentaReemplazoId) {
      setError('Selecciona una cuenta disponible para reemplazar la afectada.');
      return;
    }
    setCargando(true);
    setError('');
    try {
      const body = seleccionado.accion === 'recuperar'
        ? JSON.stringify({ nuevaClave: clave })
        : seleccionado.accion === 'reemplazar'
          ? JSON.stringify({ cuentaReemplazoId })
          : undefined;
      await fetchApi(`/reclamos/${seleccionado.reclamo.id}/${seleccionado.accion}`, {
        method: 'PUT',
        ...(body ? { body } : {}),
      });
      await cargar();
      setSeleccionado(null);
      setClave('');
      setCuentaReemplazoId('');
      setCuentasReemplazo([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo resolver el registro.');
    } finally {
      setCargando(false);
    }
  };

  const abrirReemplazo = async (reclamo: Reclamo) => {
    setSeleccionado({ reclamo, accion: 'reemplazar' });
    setCuentaReemplazoId('');
    setCuentasReemplazo([]);
    setCargandoReemplazos(true);
    setError('');
    try {
      setCuentasReemplazo(await fetchApi<CuentaReemplazo[]>(`/reclamos/${reclamo.id}/reemplazos`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las cuentas de reemplazo.');
    } finally {
      setCargandoReemplazos(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Auditoría de cuentas observadas</h1>
        <p className="mt-1 text-sm text-slate-400">Reemplaza la cuenta afectada con otra del inventario del distribuidor. Después, verifica si la cuenta original puede recuperarse o debe descartarse.</p>
      </header>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {reclamos.length === 0 && !error && <p className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">No hay cuentas observadas pendientes.</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4">Reporte</th>
              <th className="p-4">Venta</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {reclamos.map((reclamo) => (
              <tr key={reclamo.id}>
                <td className="p-4">
                  <p className="font-medium text-slate-200">{reclamo.categoriaFallo}</p>
                  <p className="mt-1 text-xs text-cyan-300">{reclamo.servicio} · {reclamo.correoAfectado}</p>
                  <p className="mt-1 max-w-md text-xs text-slate-500">{reclamo.motivo}</p>
                </td>
                <td className="p-4 font-mono text-xs text-slate-400">{reclamo.ventaId.slice(0, 8)}</td>
                <td className="p-4"><span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">{reclamo.estado}</span></td>
                <td className="space-x-2 p-4 text-right">
                  <button type="button" onClick={() => void abrirEvidencia(reclamo)} className="text-xs font-medium text-slate-300 underline underline-offset-4 hover:text-white">Ver evidencia</button>
                  {reclamo.estado === 'PENDIENTE_AUDITORIA' ? (
                    <button type="button" onClick={() => void abrirReemplazo(reclamo)} className="rounded-lg bg-cyan-700 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600">Reemplazar cuenta</button>
                  ) : (
                    <>
                      <button type="button" onClick={() => setSeleccionado({ reclamo, accion: 'recuperar' })} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600">Recuperar cuenta afectada</button>
                      <button type="button" onClick={() => setSeleccionado({ reclamo, accion: 'descartar' })} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-red-900 hover:text-red-300">Descartar cuenta afectada</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={seleccionado?.accion === 'descartar'}
        title="Descartar cuenta observada"
        description="La cuenta defectuosa se marcará como DESCARTADO y no volverá al inventario."
        confirmLabel="Descartar cuenta"
        destructive
        loading={cargando}
        onCancel={() => setSeleccionado(null)}
        onConfirm={() => void confirmar()}
      />
      <ConfirmModal
        open={seleccionado?.accion === 'recuperar'}
        title="Recuperar cuenta"
        description="La contraseña se restablecerá y la cuenta volverá al stock disponible para venta."
        confirmLabel="Restablecer y recuperar"
        loading={cargando}
        onCancel={() => setSeleccionado(null)}
        onConfirm={() => void confirmar()}
      >
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Nueva contraseña</span>
          <input required minLength={8} value={clave} onChange={(event) => setClave(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
        </label>
      </ConfirmModal>
      <ConfirmModal
        open={seleccionado?.accion === 'reemplazar'}
        title="Reemplazar cuenta del comprador"
        description="Elige una cuenta disponible del mismo servicio en el inventario del distribuidor. Las nuevas credenciales se actualizarán en la compra y se enviarán al comprador."
        confirmLabel="Reemplazar cuenta"
        loading={cargando}
        confirmDisabled={cargandoReemplazos || cuentasReemplazo.length === 0 || !cuentaReemplazoId}
        onCancel={() => { setSeleccionado(null); setCuentaReemplazoId(''); }}
        onConfirm={() => void confirmar()}
      >
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Cuenta de reemplazo</span>
          <select
            value={cuentaReemplazoId}
            onChange={(event) => setCuentaReemplazoId(event.target.value)}
            disabled={cargandoReemplazos || cuentasReemplazo.length === 0}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          >
            <option value="">
              {cargandoReemplazos ? 'Cargando inventario...' : 'Selecciona una cuenta'}
            </option>
            {cuentasReemplazo.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id}>
                {cuenta.correo} · {cuenta.tipoStock}
              </option>
            ))}
          </select>
          {!cargandoReemplazos && cuentasReemplazo.length === 0 && (
            <span className="block text-xs text-amber-300">El distribuidor no tiene cuentas disponibles de este servicio.</span>
          )}
        </label>
      </ConfirmModal>
      <ReceiptViewerModal
        open={Boolean(evidencia)}
        src={evidencia?.url ?? null}
        mimeType={evidencia?.mimeType}
        onClose={() => setEvidencia(null)}
      />
    </div>
  );
}
