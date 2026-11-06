'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { CredentialCard } from '@/components/client/CredentialCard';

interface CuentaAdquirida {
  id: string;
  servicio: string;
  correo: string;
  password: string;
  perfilPin: string | null;
  fechaVenta: string;
}

interface PedidoComprador {
  id: string;
  servicio: string;
  monto: number;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  motivoRechazo: string | null;
  fechaSolicitud: string;
}

export default function HistorialCompradorPage() {
  const [cuentas, setCuentas] = useState<CuentaAdquirida[]>([]);
  const [pedidos, setPedidos] = useState<PedidoComprador[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchApi<CuentaAdquirida[]>('/ventas/mis-compras'),
      fetchApi<PedidoComprador[]>('/pagos/mis-pedidos'),
    ])
      .then(([compras, pedidosComprador]) => {
        setCuentas(compras);
        setPedidos(pedidosComprador);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar el historial.'));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Mis Cuentas Adquiridas</h1>
        <p className="text-gray-400 text-sm mt-1">Consulta tus credenciales de acceso activas.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      {pedidos.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Pedidos y pagos</h2>
          {pedidos.map((pedido) => (
            <article key={pedido.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
              <div>
                <p className="font-semibold text-white">{pedido.servicio} · S/ {Number(pedido.monto).toFixed(2)}</p>
                <p className="mt-1 text-xs text-gray-400">Pedido {pedido.id} · {new Date(pedido.fechaSolicitud).toLocaleString()}</p>
                {pedido.estado === 'PENDIENTE' && <p className="mt-1 text-sm text-amber-300">Comprobante recibido; esperando la validación del distribuidor.</p>}
                {pedido.estado === 'RECHAZADO' && <p className="mt-1 text-sm text-red-300">Pago rechazado: {pedido.motivoRechazo ?? 'Comunícate con el distribuidor.'}</p>}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${pedido.estado === 'PENDIENTE' ? 'bg-amber-950 text-amber-300' : pedido.estado === 'RECHAZADO' ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'}`}>
                {pedido.estado === 'PENDIENTE' ? 'En revisión' : pedido.estado === 'RECHAZADO' ? 'Rechazado' : 'Aprobado'}
              </span>
            </article>
          ))}
        </section>
      )}

      {!error && cuentas.length === 0 && pedidos.length === 0 && <p className="text-sm text-gray-400">Aún no tienes compras ni pedidos registrados.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cuentas.map((c) => {
          return (
            <CredentialCard
              key={c.id}
              servicio={c.servicio}
              correo={c.correo}
              password={c.password}
              perfilPin={c.perfilPin}
              fecha={c.fechaVenta}
            />
          );
        })}
      </div>
    </div>
  );
}