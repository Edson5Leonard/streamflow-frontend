'use client';

import { useState } from 'react';

interface Reclamo {
  id: number;
  cliente: string;
  servicio: string;
  fallo: string;
  cuentaAfectada: string;
  estado: 'PENDIENTE' | 'REEMPLAZADO' | 'ELIMINADO_DEFECTUOSO';
}

const INITIAL_RECLAMOS: Reclamo[] = [
  { id: 1, cliente: 'Carlos R.', servicio: 'Max (HBO)', fallo: 'Contraseña Incorrecta', cuentaAfectada: 'hbo1@saas.com', estado: 'PENDIENTE' },
  { id: 2, cliente: 'Ana P.', servicio: 'Disney+', fallo: 'Perfil Bloqueado', cuentaAfectada: 'disney2@saas.com', estado: 'REEMPLAZADO' },
];

export default function ReclamosPage() {
  const [reclamos, setReclamos] = useState<Reclamo[]>(INITIAL_RECLAMOS);

  const handleAsignarReemplazo = (id: number) => {
    setReclamos(
      reclamos.map((r) => (r.id === id ? { ...r, estado: 'REEMPLAZADO' } : r))
    );
    alert('Se ha asignado automáticamente un perfil nuevo del stock al cliente.');
  };

  const handleBorrarDefectuosa = (id: number) => {
    setReclamos(
      reclamos.map((r) => (r.id === id ? { ...r, estado: 'ELIMINADO_DEFECTUOSO' } : r))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Garantías y Reemplazos Nocturnos</h1>
        <p className="text-gray-400 text-sm mt-1">Revisión de reportes en tiempo real y depuración de cuentas dañadas.</p>
      </div>

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
                <td className="p-4 font-bold text-white">{rec.cliente}</td>
                <td className="p-4">
                  <p className="font-bold text-blue-400">{rec.servicio}</p>
                  <p className="text-xs text-red-400 font-semibold">{rec.fallo}</p>
                </td>
                <td className="p-4 font-mono text-xs text-gray-400">{rec.cuentaAfectada}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                      rec.estado === 'REEMPLAZADO'
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
                      onClick={() => handleAsignarReemplazo(rec.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-blue-600/20"
                    >
                      Enviar Reemplazo
                    </button>
                  )}
                  {rec.estado !== 'ELIMINADO_DEFECTUOSO' && (
                    <button
                      onClick={() => handleBorrarDefectuosa(rec.id)}
                      className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition border border-red-500/20"
                    >
                      Depurar Cuenta
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