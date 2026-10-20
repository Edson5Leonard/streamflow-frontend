'use client';

import { useState } from 'react';

interface PagoSuscripcion {
  id: number;
  distribuidor: string;
  monto: number;
  fecha: string;
  comprobanteUrl: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
}

const INITIAL_PAGOS: PagoSuscripcion[] = [
  { id: 101, distribuidor: 'Distribuidora Lima Streaming', monto: 30.00, fecha: '2026-10-19 14:30', comprobanteUrl: '📱 Captura_Yape_01.png', estado: 'PENDIENTE' },
  { id: 102, distribuidor: 'Digital Store Perú', monto: 30.00, fecha: '2026-10-18 09:15', comprobanteUrl: '📱 Captura_Plin_02.png', estado: 'APROBADO' },
];

export default function PagosSuscripcionPage() {
  const [pagos, setPagos] = useState<PagoSuscripcion[]>(INITIAL_PAGOS);

  const handleCambiarEstado = (id: number, nuevoEstado: 'APROBADO' | 'RECHAZADO') => {
    setPagos(
      pagos.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Verificación de Pagos Yape / Plin</h1>
        <p className="text-gray-400 text-sm mt-1">Aprobación de cuotas mensuales (S/ 30) enviadas por distribuidores.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
            <tr>
              <th className="p-4">Distribuidor</th>
              <th className="p-4">Monto / Fecha</th>
              <th className="p-4">Comprobante</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {pagos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-800/40 transition">
                <td className="p-4 font-bold text-white">{p.distribuidor}</td>
                <td className="p-4">
                  <p className="text-green-400 font-extrabold">S/ {p.monto.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{p.fecha}</p>
                </td>
                <td className="p-4 text-xs font-mono text-blue-400 underline cursor-pointer">
                  {p.comprobanteUrl}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                      p.estado === 'APROBADO'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : p.estado === 'PENDIENTE'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {p.estado}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {p.estado === 'PENDIENTE' && (
                    <>
                      <button
                        onClick={() => handleCambiarEstado(p.id, 'APROBADO')}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-green-600/20"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleCambiarEstado(p.id, 'RECHAZADO')}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition border border-red-500/30"
                      >
                        Rechazar
                      </button>
                    </>
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