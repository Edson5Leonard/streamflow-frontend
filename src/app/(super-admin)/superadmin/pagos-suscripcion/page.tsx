'use client';

import { useEffect, useState } from 'react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ReceiptViewerModal } from '@/components/ui/ReceiptViewerModal';
import { fetchApi, fetchApiBlob } from '@/lib/api';
import type { MetodoPago } from '@/components/payments/PaymentInstructions';

interface PagoMembresia {
  id: string;
  distribuidorId: string;
  distribuidorNombre: string;
  monto: number;
  fechaSolicitud: string;
  comprobanteUrl: string;
  metodoPago: MetodoPago;
  codigoOperacion: string | null;
}

type Accion = 'aprobar' | 'rechazar';

export default function PagosSuscripcionPage() {
  const [pagos, setPagos] = useState<PagoMembresia[]>([]);
  const [seleccionado, setSeleccionado] = useState<{ pago: PagoMembresia; accion: Accion } | null>(null);
  const [motivo, setMotivo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [comprobante, setComprobante] = useState<{ url: string; mimeType: string } | null>(null);

  const cargar = async () => {
    setPagos(await fetchApi<PagoMembresia[]>('/membresias/pendientes'));
  };

  useEffect(() => {
    Promise.resolve().then(cargar).catch((err: unknown) =>
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las solicitudes.'));
  }, []);

  useEffect(() => {
    return () => {
      if (comprobante) URL.revokeObjectURL(comprobante.url);
    };
  }, [comprobante]);

  const verComprobante = async (pago: PagoMembresia) => {
    try {
      const nombre = pago.comprobanteUrl.split('/').pop();
      if (!nombre) throw new Error('El pago no tiene un comprobante válido.');
      const blob = await fetchApiBlob(`/membresias/comprobantes/${encodeURIComponent(nombre)}`);
      setComprobante({ url: URL.createObjectURL(blob), mimeType: blob.type });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir el comprobante.');
    }
  };

  const confirmar = async () => {
    if (!seleccionado) return;
    setCargando(true);
    setError('');
    try {
      await fetchApi(`/membresias/${seleccionado.pago.id}/${seleccionado.accion}`, {
        method: 'PUT',
        ...(seleccionado.accion === 'rechazar' ? { body: JSON.stringify({ motivo }) } : {}),
      });
      setPagos((actuales) => actuales.filter((pago) => pago.id !== seleccionado.pago.id));
      setSeleccionado(null);
      setMotivo('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la membresía.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Pagos de membresía</h1>
        <p className="mt-1 text-sm text-slate-400">Verifica el comprobante bancario antes de extender 30 días el acceso del distribuidor.</p>
      </header>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {pagos.length === 0 && !error && <p className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">No hay comprobantes pendientes.</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4">Distribuidor</th>
              <th className="p-4">Monto / fecha</th>
              <th className="p-4">Método / operación</th>
              <th className="p-4">Comprobante</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td className="p-4 font-medium text-slate-200">{pago.distribuidorNombre}</td>
                <td className="p-4">
                  <p className="font-semibold text-slate-100">S/ {Number(pago.monto).toFixed(2)}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(pago.fechaSolicitud).toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p>{pago.metodoPago}</p>
                  {pago.codigoOperacion && <p className="mt-1 text-xs text-slate-500">{pago.codigoOperacion}</p>}
                </td>
                <td className="p-4">
                  <button type="button" onClick={() => void verComprobante(pago)} className="text-xs font-medium text-slate-300 underline underline-offset-4 hover:text-white">Ver captura</button>
                </td>
                <td className="space-x-2 p-4 text-right">
                  <button type="button" onClick={() => setSeleccionado({ pago, accion: 'aprobar' })} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600">Aprobar 30 días</button>
                  <button type="button" onClick={() => { setMotivo(''); setSeleccionado({ pago, accion: 'rechazar' }); }} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-red-900 hover:text-red-300">Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={seleccionado?.accion === 'aprobar'}
        title="Aprobar membresía"
        description="Se activará la tienda y se extenderá su membresía por 30 días desde su vencimiento actual o desde hoy."
        confirmLabel="Aprobar membresía"
        loading={cargando}
        onCancel={() => setSeleccionado(null)}
        onConfirm={() => void confirmar()}
      />
      <ConfirmModal
        open={seleccionado?.accion === 'rechazar'}
        title="Rechazar comprobante"
        description="El distribuidor conservará su estado actual. Indica un motivo claro para la corrección."
        confirmLabel="Rechazar pago"
        destructive
        loading={cargando}
        onCancel={() => setSeleccionado(null)}
        onConfirm={() => void confirmar()}
      >
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Motivo</span>
          <textarea required maxLength={500} value={motivo} onChange={(event) => setMotivo(event.target.value)} className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white" />
        </label>
      </ConfirmModal>
      <ReceiptViewerModal
        open={Boolean(comprobante)}
        src={comprobante?.url ?? null}
        mimeType={comprobante?.mimeType}
        onClose={() => setComprobante(null)}
      />
    </div>
  );
}
