'use client';

import { useEffect, useState } from 'react';
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
  estado: string;
}

interface Usuario {
  id: string;
  nombreCompleto: string;
}

export default function ReclamosPage() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [nombres, setNombres] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [actualizando, setActualizando] = useState<string | null>(null);
  const [evidencia, setEvidencia] = useState<{ url: string; mimeType: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetchApi<Reclamo[]>('/reclamos/pendientes'),
      fetchApi<Usuario[]>('/usuarios'),
    ])
      .then(([reclamosData, usuarios]) => {
        setReclamos(reclamosData);
        setNombres(Object.fromEntries(usuarios.map((usuario) => [usuario.id, usuario.nombreCompleto])));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudieron cargar los reclamos.'));
  }, []);

  useEffect(() => {
    return () => {
      if (evidencia) URL.revokeObjectURL(evidencia.url);
    };
  }, [evidencia]);

  const abrirEvidencia = async (reclamo: Reclamo) => {
    try {
      const nombreArchivo = reclamo.comprobanteFalloUrl.split('/').pop();
      if (!nombreArchivo) throw new Error('La evidencia no tiene una ruta válida.');
      const blob = await fetchApiBlob(`/reclamos/comprobantes/${encodeURIComponent(nombreArchivo)}`);
      setEvidencia({ url: URL.createObjectURL(blob), mimeType: blob.type });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir la evidencia.');
    }
  };

  const actualizarEstado = async (id: string, estado: 'PENDIENTE_AUDITORIA' | 'RESUELTO' | 'RECHAZADO') => {
    setActualizando(id);
    setError('');
    setMensaje('');
    try {
      await fetchApi(`/reclamos/${id}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ estado }),
      });
      setReclamos((actuales) => actuales.filter((reclamo) => reclamo.id !== id));
      if (estado === 'PENDIENTE_AUDITORIA') {
        setMensaje('Reporte enviado al administrador. La cuenta afectada quedó observada hasta que se resuelva.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el reclamo.');
    } finally {
      setActualizando(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Gestión de Garantías</h1>
        <p className="text-gray-400 text-sm mt-1">Revisa la evidencia y la cuenta afectada. Cuando confirmes la falla, envía el reporte al administrador para que gestione el reemplazo.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {mensaje && <p role="status" className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-4 text-sm text-emerald-300">{mensaje}</p>}
      {!error && reclamos.length === 0 && <p className="text-sm text-gray-400">No hay reclamos pendientes en tu tienda.</p>}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Servicio / Reporte</th>
              <th className="p-4">Cuenta Afectada</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {reclamos.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-800/40 transition">
                <td className="p-4 font-bold text-white">{nombres[rec.usuarioId] ?? rec.usuarioId}</td>
                <td className="p-4">
                  <p className="font-bold text-white">{rec.servicio}</p>
                  <p className="font-bold text-blue-400">{rec.categoriaFallo}</p>
                  <p className="text-xs text-red-400 font-semibold">{rec.motivo}</p>
                </td>
                <td className="p-4">
                  <p className="font-mono text-xs text-gray-200">{rec.correoAfectado}</p>
                  <p className="mt-1 text-[11px] text-gray-500">Venta {rec.ventaId.slice(0, 8)}</p>
                  <button type="button" onClick={() => void abrirEvidencia(rec)} className="mt-2 text-xs font-medium text-cyan-300 underline underline-offset-4 hover:text-cyan-200">Ver evidencia</button>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                      rec.estado === 'RESUELTO'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : rec.estado === 'PENDIENTE'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {rec.estado}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {rec.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => actualizarEstado(rec.id, 'PENDIENTE_AUDITORIA')}
                      disabled={actualizando !== null}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-blue-600/20"
                    >
                      {actualizando === rec.id ? 'Enviando...' : 'Enviar a administración'}
                    </button>
                  )}
                  {rec.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => actualizarEstado(rec.id, 'RECHAZADO')}
                      disabled={actualizando !== null}
                      className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition border border-red-500/20"
                    >
                      Rechazar reporte
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReceiptViewerModal
        open={Boolean(evidencia)}
        src={evidencia?.url ?? null}
        mimeType={evidencia?.mimeType}
        onClose={() => setEvidencia(null)}
      />
    </div>
  );
}