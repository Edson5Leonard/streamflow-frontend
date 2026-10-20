'use client';

import Link from 'next/link';
import { handleLogout } from '@/lib/auth';

export default function DistribuidorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-yellow-400">PANEL DISTRIBUIDOR</h2>
          <nav className="flex flex-col space-y-3">
            <Link href="/admin" className="hover:text-yellow-400">📈 Resumen Ventas</Link>
            <Link href="/admin/inventario" className="hover:text-yellow-400">📦 Cargar Stock</Link>
            <Link href="/admin/saldos" className="hover:text-yellow-400">💰 Aprobar Yape/Plin</Link>
            <Link href="/admin/reclamos" className="hover:text-yellow-400">🛡️ Reclamos Nocturnos</Link>
            <Link href="/admin/clientes" className="hover:text-yellow-400">👥 Mis Clientes</Link>
          </nav>
        </div>

        {/* Botón Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded font-semibold transition"
        >
          🚪 Cerrar Sesión
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}