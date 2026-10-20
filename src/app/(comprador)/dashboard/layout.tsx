'use client';

import Link from 'next/link';
import { handleLogout } from '@/lib/auth';

export default function CompradorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center px-8">
        <h2 className="text-lg font-bold text-blue-400">MI TIENDA STREAMING</h2>
        <nav className="flex items-center space-x-6">
          <Link href="/dashboard/catalogo" className="hover:text-blue-400">🛒 Catálogo</Link>
          <Link href="/dashboard/historial" className="hover:text-blue-400">📋 Mis Cuentas</Link>
          <Link href="/dashboard/recargar" className="hover:text-blue-400">💵 Recargar Saldo</Link>
          <Link href="/dashboard/soporte" className="hover:text-blue-400">🤖 Soporte / Bot</Link>
          
          {/* Botón Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded text-sm font-semibold transition"
          >
            Salir
          </button>
        </nav>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}