'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DistribuidorDashboard() {
  const [ventasHoy] = useState(14);
  const [ingresosHoy] = useState(168.00);
  const [saldoStockGlobal] = useState(120.00);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Resumen de Ventas de mi Tienda</h1>
        <p className="text-gray-400 text-sm mt-1">Panel de control de tu sub-tienda streaming.</p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ventas del Día</p>
          <p className="text-3xl font-black text-amber-400 mt-2">{ventasHoy} Cuentas</p>
          <p className="text-xs text-gray-500 mt-1">Ingreso estimado: S/ {ingresosHoy.toFixed(2)}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Clientes Registrados</p>
          <p className="text-3xl font-black text-blue-400 mt-2">28 Compradores</p>
          <p className="text-xs text-green-400 mt-1">+3 nuevos esta semana</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Saldo para Cargar Stock</p>
          <p className="text-3xl font-black text-green-400 mt-2">S/ {saldoStockGlobal.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Suscripción al día (Corte: 2026-11-01)</p>
        </div>
      </div>

      {/* Acceso Rápido y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-bold text-white text-lg">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/inventario" className="p-4 bg-gray-950 border border-gray-800 rounded-xl hover:border-amber-500/50 transition">
              <span className="text-xl block mb-1">📦</span>
              <span className="text-sm font-bold text-white block">Cargar Stock</span>
              <span className="text-xs text-gray-500">Subir cuentas o perfiles</span>
            </Link>
            <Link href="/admin/saldos" className="p-4 bg-gray-950 border border-gray-800 rounded-xl hover:border-amber-500/50 transition">
              <span className="text-xl block mb-1">💰</span>
              <span className="text-sm font-bold text-white block">Aprobar Yape</span>
              <span className="text-xs text-gray-500">Recargas de saldo</span>
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-bold text-white text-lg">Últimas Compras Recibidas</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800">
              <div>
                <p className="font-bold text-white">Juan Pérez</p>
                <p className="text-gray-500">Netflix Premium (1 Perfil)</p>
              </div>
              <span className="font-extrabold text-green-400">S/ 12.00</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800">
              <div>
                <p className="font-bold text-white">María Gómez</p>
                <p className="text-gray-500">Disney+ Standard</p>
              </div>
              <span className="font-extrabold text-green-400">S/ 9.00</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}