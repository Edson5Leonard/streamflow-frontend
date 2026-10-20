'use client';

import { useState } from 'react';

interface RecargaSaldo {
  id: number;
  cliente: string;
  monto: number;
  fecha: string;
  estado: 'PENDIENTE' | 'APROBADO';
}

const INITIAL_RECARGAS: RecargaSaldo[] = [
  { id: 1, cliente: 'Juan Pérez', monto: 20.00, fecha: '2026-10-20 01:10', estado: 'PENDIENTE' },
  { id: 2, cliente: 'María Gómez', monto: 15.00, fecha: '2026-10-19 22:45', estado: 'APROBADO' },
];

export default function SaldosPage() {
  const [recargas, setRecargas] = useState<RecargaSaldo[]>(INITIAL_RECARGAS);

  const handleAprobar = (id: number) => {
    setRecargas(recargas.map((r) => (r.id === id ? { ...r, estado: 'APROBADO' } : r)));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Solicitudes de Saldo (Yape / Plin)</h1>
        <p className="text-gray-400 text-sm mt-1">Aprueba recargas para que tus compradores canjeen cuentas.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
            <tr>
              <th className="p-4">Comprador</th>
              <th className="p-4">Monto Solicitado</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {recargas.map((r) => (
              <tr key={r.id} className="hover:bg-gray-800/40 transition">
                <td className="p-4 font-bold text-white">{r.cliente}</td>
                <td className="p-4 font-extrabold text-green-400">S/ {r.monto.toFixed(2)}</td>
                <td className="p-4 text-xs text-gray-400">{r.fecha}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                      r.estado === 'APROBADO'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    {r.estado}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {r.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => handleAprobar(r.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-green-600/20"
                    >
                      Aprobar Saldo
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