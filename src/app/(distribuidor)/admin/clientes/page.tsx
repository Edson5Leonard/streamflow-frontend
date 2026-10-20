'use client';

import { useState } from 'react';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  saldo: number;
  comprasRealizadas: number;
  fechaRegistro: string;
}

const INITIAL_CLIENTES: Cliente[] = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@gmail.com', saldo: 15.00, comprasRealizadas: 4, fechaRegistro: '2026-09-10' },
  { id: 2, nombre: 'María Gómez', email: 'maria.gomez@hotmail.com', saldo: 0.00, comprasRealizadas: 2, fechaRegistro: '2026-10-01' },
  { id: 3, nombre: 'Carlos Rodríguez', email: 'crodriguez@outlook.com', saldo: 8.50, comprasRealizadas: 6, fechaRegistro: '2026-08-15' },
];

export default function ClientesDistribuidorPage() {
  const [clientes] = useState<Cliente[]>(INITIAL_CLIENTES);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Directorio de Compradores Finales</h1>
        <p className="text-gray-400 text-sm mt-1">Lista de clientes registrados en tu sub-tienda y sus saldos actuales.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-400 font-semibold uppercase text-xs">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Correo</th>
              <th className="p-4">Saldo Disponible</th>
              <th className="p-4">Total Compras</th>
              <th className="p-4">Fecha Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {clientes.map((c) => (
              <tr key={c.id} className="hover:bg-gray-800/40 transition">
                <td className="p-4 font-bold text-white">{c.nombre}</td>
                <td className="p-4 text-xs text-gray-400 font-mono">{c.email}</td>
                <td className="p-4 font-bold text-green-400">S/ {c.saldo.toFixed(2)}</td>
                <td className="p-4 text-xs font-semibold text-amber-400">{c.comprasRealizadas} Cuentas</td>
                <td className="p-4 text-xs text-gray-500">{c.fechaRegistro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}