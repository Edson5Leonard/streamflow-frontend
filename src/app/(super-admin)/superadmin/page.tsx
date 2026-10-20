'use client';

import { useState } from 'react';

const INGRESOS_MESES = [
  { mes: 'Ene', monto: 300 },
  { mes: 'Feb', monto: 450 },
  { mes: 'Mar', monto: 600 },
  { mes: 'Abr', monto: 510 },
  { mes: 'May', monto: 750 },
  { mes: 'Jun', monto: 900 },
];

export default function SuperAdminDashboard() {
  const [filtroPeriodo, setFiltroPeriodo] = useState('2026');

  const totalAnual = INGRESOS_MESES.reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Métricas Globales SaaS</h1>
          <p className="text-gray-400 text-sm mt-1">Resumen financiero y control de distribuidores.</p>
        </div>
        <select
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl focus:outline-none"
        >
          <option value="2026">Año 2026</option>
          <option value="2025">Año 2025</option>
        </select>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Distribuidores Activos</p>
          <p className="text-3xl font-black text-green-400 mt-2">12 / 14</p>
          <p className="text-xs text-gray-500 mt-1">2 cuentas suspendidas</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ingresos por Membresía (S/ 30)</p>
          <p className="text-3xl font-black text-blue-400 mt-2">S/ 360.00</p>
          <p className="text-xs text-blue-400/80 mt-1">Cobro mensual corriente</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ventas de Stock a Mayoristas</p>
          <p className="text-3xl font-black text-indigo-400 mt-2">S/ 3,150.00</p>
          <p className="text-xs text-gray-500 mt-1">Acumulado {filtroPeriodo}</p>
        </div>
      </div>

      {/* Gráfico Simulado de Ingresos Mensuales */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
        <h3 className="font-bold text-white text-lg">Evolución de Ingresos ({filtroPeriodo})</h3>
        
        <div className="flex items-end justify-between h-48 pt-6 px-4 border-b border-gray-800">
          {INGRESOS_MESES.map((item) => {
            const porcentaje = (item.monto / 1000) * 100;
            return (
              <div key={item.mes} className="flex flex-col items-center space-y-2 group flex-1">
                <span className="text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  S/ {item.monto}
                </span>
                <div
                  style={{ height: `${porcentaje}%` }}
                  className="w-10 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg group-hover:from-blue-500 group-hover:to-indigo-400 transition-all"
                />
                <span className="text-xs text-gray-400 font-semibold">{item.mes}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 font-medium">
          <span>Proyección anual estimada: S/ {(totalAnual * 2).toFixed(2)}</span>
          <span className="text-green-400 font-bold">+24% respecto al año anterior</span>
        </div>
      </div>
    </div>
  );
}