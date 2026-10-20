'use client';

import { useState } from 'react';

interface CuentaAdquirida {
  id: number;
  servicio: string;
  email: string;
  password: string;
  perfil: string;
  pin: string;
  fechaCompra: string;
}

const INITIAL_MIS_CUENTAS: CuentaAdquirida[] = [
  { id: 1, servicio: 'Netflix Premium', email: 'net_tienda1@gmail.com', password: 'clave123', perfil: 'Perfil 1', pin: '1234', fechaCompra: '2026-10-18' },
  { id: 2, servicio: 'Max (HBO)', email: 'hbo_tienda1@gmail.com', password: 'clave789', perfil: 'Perfil 2', pin: '3333', fechaCompra: '2026-10-10' },
];

export default function HistorialCompradorPage() {
  const [cuentas] = useState<CuentaAdquirida[]>(INITIAL_MIS_CUENTAS);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Mis Cuentas Adquiridas</h1>
        <p className="text-gray-400 text-sm mt-1">Consulta tus credenciales de acceso activas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cuentas.map((c) => (
          <div key={c.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-white text-lg">{c.servicio}</h3>
              <span className="text-xs text-gray-500">{c.fechaCompra}</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                <span className="text-gray-500 block">Correo:</span>
                <span className="text-blue-400 font-bold">{c.email}</span>
              </div>
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                <span className="text-gray-500 block">Contraseña:</span>
                <span className="text-amber-400 font-bold">{c.password}</span>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block">Perfil:</span>
                  <span className="text-white font-bold">{c.perfil}</span>
                </div>
                <div className="flex-1 bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block">PIN:</span>
                  <span className="text-green-400 font-bold">{c.pin}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}