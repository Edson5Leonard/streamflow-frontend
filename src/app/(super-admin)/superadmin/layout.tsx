'use client';

import Link from 'next/link';
import { handleLogout } from '@/lib/auth';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-extrabold text-white shadow-lg shadow-red-600/20">
              SA
            </div>
            <span className="font-extrabold text-sm tracking-wide text-red-400">SUPER ADMIN</span>
          </div>

          <nav className="flex flex-col space-y-2">
            <Link href="/superadmin" className="p-3 rounded-xl hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold transition">
              📊 Métricas Globales
            </Link>
            <Link href="/superadmin/distribuidores" className="p-3 rounded-xl hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold transition">
              🏪 Distribuidores
            </Link>
            <Link href="/superadmin/stock-global" className="p-3 rounded-xl hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold transition">
              📦 Stock Global
            </Link>
            <Link href="/superadmin/pagos-suscripcion" className="p-3 rounded-xl hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold transition">
              💳 Cobros S/ 30
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-xl font-bold text-xs transition"
        >
          Cerrar Sesión
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}