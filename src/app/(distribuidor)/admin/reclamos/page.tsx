'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface Reclamo {
  id: string;
  usuarioId: string;
  ventaId: string;
  categoriaFallo: string;
  motivo: string;
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
  const [actualizando, setActualizando] = useState<string | null>(null);

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

  const actualizarEstado = async (id: string, estado: 'RESUELTO' | 'RECHAZADO') => {
    setActualizando(id);
    setError('');
    try {
      await fetchApi(`/reclamos/${id}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ estado }),
      });
      setReclamos((actuales) => actuales.filter((reclamo) => reclamo.id !== id));
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
        <p className="text-gray-400 text-sm mt-1">Revisa y actualiza el estado de los reportes de tus compradores.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {!error && reclamos.length === 0 && <p className="text-sm text-gray-400">No hay reclamos pendientes en tu tienda.</p>}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
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
                  <p className="font-bold text-blue-400">{rec.categoriaFallo}</p>
                  <p className="text-xs text-red-400 font-semibold">{rec.motivo}</p>
                </td>
                <td className="p-4 font-mono text-xs text-gray-400">{rec.ventaId.slice(0, 8)}</td>
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
                      onClick={() => actualizarEstado(rec.id, 'RESUELTO')}
                      disabled={actualizando !== null}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-blue-600/20"
                    >
                      {actualizando === rec.id ? 'Guardando...' : 'Marcar resuelto'}
                    </button>
                  )}
                  {rec.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => actualizarEstado(rec.id, 'RECHAZADO')}
                      disabled={actualizando !== null}
                      className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition border border-red-500/20"
                    >
                      Rechazar
                    </button>
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