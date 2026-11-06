'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchApi, fetchApiBlob } from '@/lib/api';
import type { Pago } from '@/types/pago';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ReceiptViewerModal } from '@/components/ui/ReceiptViewerModal';

interface Sesion {
  usuarioId: string;
}

interface Usuario {
  id: string;
  nombreCompleto: string;
  whatsapp?: string | null;
}

interface Servicio {
  id: string;
  nombre: string;
}

export default function PedidosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [nombresCompradores, setNombresCompradores] = useState<Record<string, string>>({});
  const [whatsappCompradores, setWhatsappCompradores] = useState<Record<string, string>>({});
  const [nombresServicios, setNombresServicios] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [confirmacion, setConfirmacion] = useState<{ pago: Pago; accion: 'aprobar' | 'rechazar' } | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [comprobante, setComprobante] = useState<{ url: string; mimeType: string } | null>(null);

  const cargarPagos = useCallback(async () => {
    const sesion = await fetchApi<Sesion>('/auth/me');
    const [pendientes, usuarios, servicios] = await Promise.all([
      fetchApi<Pago[]>(`/pagos/distribuidor?distribuidorId=${encodeURIComponent(sesion.usuarioId)}`),
      fetchApi<Usuario[]>('/usuarios'),
      fetchApi<Servicio[]>('/servicios/activos'),
    ]);
    setPagos(pendientes);
    setNombresCompradores(Object.fromEntries(usuarios.map((usuario) => [usuario.id, usuario.nombreCompleto])));
    setWhatsappCompradores(Object.fromEntries(usuarios.map((usuario) => [usuario.id, usuario.whatsapp ?? ''])));
    setNombresServicios(Object.fromEntries(servicios.map((servicio) => [servicio.id, servicio.nombre])));
  }, []);

  useEffect(() => {
    Promise.resolve()
      .then(cargarPagos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudieron cargar los pedidos.'));
  }, [cargarPagos]);

  useEffect(() => {
    return () => {
      if (comprobante) URL.revokeObjectURL(comprobante.url);
    };
  }, [comprobante]);

  const confirmarAccion = async () => {
    if (!confirmacion) return;
    setProcesando(true);
    setError('');
    try {
      const { pago, accion } = confirmacion;
      await fetchApi(`/pagos/${pago.id}/${accion}`, {
        method: 'PUT',
        ...(accion === 'rechazar' ? { body: JSON.stringify({ motivo }) } : {}),
      });
      setPagos((current) => current.filter((actual) => actual.id !== pago.id));
      setConfirmacion(null);
      setMotivo('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar el pedido.');
    } finally {
      setProcesando(false);
    }
  };

  const verComprobante = async (pago: Pago) => {
    setError('');
    try {
      const nombreArchivo = pago.comprobanteUrl.split('/').pop();
      if (!nombreArchivo) {
        throw new Error('El pedido no tiene una ruta de comprobante válida.');
      }
      const archivo = await fetchApiBlob(`/pagos/comprobantes/${encodeURIComponent(nombreArchivo)}`);
      setComprobante({ url: URL.createObjectURL(archivo), mimeType: archivo.type });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir el comprobante.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Pedidos pendientes</h1>
        <p className="mt-1 text-sm text-slate-400">Verifica los comprobantes antes de despachar cada compra.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {!error && pagos.length === 0 && <p className="text-sm text-gray-400">No hay pedidos pendientes para tu tienda.</p>}

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-950/70 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4">Servicio</th>
              <th className="p-4">Comprador</th>
              <th className="p-4">WhatsApp</th>
              <th className="p-4">Pago</th>
              <th className="p-4">Monto</th>
              <th className="p-4">Operación</th>
              <th className="p-4">Comprobante</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {pagos.map((pago) => (
              <tr key={pago.id} className="transition-colors hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white">{nombresServicios[pago.servicioId] ?? pago.servicioId}</td>
                <td className="p-4">{nombresCompradores[pago.compradorId] ?? pago.compradorId}</td>
                <td className="p-4">{whatsappCompradores[pago.compradorId] || '—'}</td>
                <td className="p-4">{pago.metodoPago}</td>
                <td className="p-4 font-semibold text-emerald-400">S/ {Number(pago.monto).toFixed(2)}</td>
                <td className="p-4">{pago.codigoOperacion}</td>
                <td className="p-4">
                  <button type="button" onClick={() => void verComprobante(pago)} className="font-medium text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white">
                    Ver captura
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setConfirmacion({ pago, accion: 'aprobar' })}
                    disabled={procesando}
                    className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMotivo(''); setConfirmacion({ pago, accion: 'rechazar' }); }}
                    disabled={procesando}
                    className="ml-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-red-900 hover:text-red-300 disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <ConfirmModal
        open={confirmacion?.accion === 'aprobar'}
        title="Aprobar pago y despachar"
        description="¿Estás seguro de que deseas aprobar el pago y despachar la cuenta? Esta acción no se puede deshacer."
        confirmLabel="Aprobar y despachar"
        loading={procesando}
        onCancel={() => setConfirmacion(null)}
        onConfirm={() => void confirmarAccion()}
      />
      <ConfirmModal
        open={confirmacion?.accion === 'rechazar'}
        title="Rechazar pago"
        description="El comprador no recibirá credenciales. Indica el motivo para que pueda corregir el problema."
        confirmLabel="Confirmar rechazo"
        destructive
        loading={procesando}
        onCancel={() => setConfirmacion(null)}
        onConfirm={() => void confirmarAccion()}
      >
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Motivo del rechazo</span>
          <textarea
            required
            maxLength={500}
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
            className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-slate-500"
            placeholder="Ej. El monto del comprobante no coincide"
          />
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