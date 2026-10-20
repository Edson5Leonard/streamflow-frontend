'use client';

import Link from 'next/link';

export default function DashboardCompradorPage() {
  const saldoActual = 15.00;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">¡Hola, Juan!</h1>
          <p className="text-gray-400 text-sm">Bienvenido a tu panel de streaming.</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block font-semibold">Tu Saldo Disponible</span>
          <span className="text-3xl font-black text-green-400">S/ {saldoActual.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/catalogo" className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition space-y-2 block">
          <span className="text-3xl block">🛒</span>
          <h3 className="font-bold text-white text-lg">Catálogo de Cuentas</h3>
          <p className="text-xs text-gray-400">Canjea saldo por accesos a Netflix, Disney+, Max y más.</p>
        </Link>

        <Link href="/dashboard/recargar" className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition space-y-2 block">
          <span className="text-3xl block">💵</span>
          <h3 className="font-bold text-white text-lg">Recargar Saldo</h3>
          <p className="text-xs text-gray-400">Envía tu comprobante de Yape o Plin para abonar saldo.</p>
        </Link>

        <Link href="/dashboard/historial" className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition space-y-2 block">
          <span className="text-3xl block">📋</span>
          <h3 className="font-bold text-white text-lg">Mis Cuentas Adquiridas</h3>
          <p className="text-xs text-gray-400">Consulta correos, claves, perfiles y PINs activos.</p>
        </Link>
      </div>
    </div>
  );
}