'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

interface Sesion {
  nombreCompleto: string;
}

export default function DashboardCompradorPage() {
  const [sesion, setSesion] = useState<Sesion>({ nombreCompleto: 'Comprador' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi<Sesion>('/auth/me')
      .then(setSesion)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar tu cuenta.'));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">¡Hola, {sesion.nombreCompleto}!</h1>
          <p className="text-gray-400 text-sm">Bienvenido a tu panel de streaming.</p>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/catalogo" className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition space-y-2 block">
          <span className="text-3xl block">🛒</span>
          <h3 className="font-bold text-white text-lg">Catálogo de Cuentas</h3>
          <p className="text-xs text-gray-400">Compra servicios y envía el comprobante del pedido directamente.</p>
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