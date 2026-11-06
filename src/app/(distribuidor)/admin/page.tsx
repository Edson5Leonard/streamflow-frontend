'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

interface Venta {
  id: string;
  compradorId: string;
  precioPagado: number;
  fechaVenta: string;
}

interface Comprador {
  id: string;
  nombreCompleto: string;
}

interface Cuenta {
  id: string;
  estado: string;
}

interface Estadisticas {
  ingresosTotales: number;
  ingresosHoy: number;
  ventasHoy: number;
  stockDisponible: number;
}

export default function DistribuidorDashboard() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [compradores, setCompradores] = useState<Comprador[]>([]);
  const [stockDisponible, setStockDisponible] = useState(0);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [hoy, setHoy] = useState<Date | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchApi<Venta[]>('/ventas'),
      fetchApi<Comprador[]>('/usuarios'),
      fetchApi<Cuenta[]>('/cuentas'),
      fetchApi<Estadisticas>('/estadisticas/distribuidor'),
    ])
      .then(([ventasData, compradoresData, cuentasData, estadisticasData]) => {
        setHoy(new Date());
        setVentas(ventasData);
        setCompradores(compradoresData);
        setStockDisponible(cuentasData.filter((cuenta) => cuenta.estado === 'DISPONIBLE').length);
        setEstadisticas(estadisticasData);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar el resumen de tienda.'));
  }, []);

  const ventasHoyData = hoy
    ? ventas.filter((venta) => new Date(venta.fechaVenta).toDateString() === hoy.toDateString())
    : [];
  const ingresosHoy = ventasHoyData.reduce((total, venta) => total + Number(venta.precioPagado), 0);
  const ultimasVentas = [...ventas].sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime()).slice(0, 3);
  const dias = hoy ? Array.from({ length: 7 }, (_, index) => {
    const date = new Date(hoy);
    date.setDate(date.getDate() - (6 - index));
    const ventasDelDia = ventas.filter((venta) => new Date(venta.fechaVenta).toDateString() === date.toDateString());
    return {
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      total: ventasDelDia.reduce((total, venta) => total + Number(venta.precioPagado), 0),
    };
  }) : [];
  const maxIngresos = Math.max(1, ...dias.map((dia) => dia.total));
  const grafica = dias.map((dia, index) =>
    `${30 + index * 90},${130 - (dia.total / maxIngresos) * 105}`,
  ).join(' ');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Resumen de la tienda</h1>
        <p className="mt-1 text-sm text-slate-400">Ventas, clientes y disponibilidad de inventario.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ingresos acumulados</p>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-100">S/ {Number(estadisticas?.ingresosTotales ?? 0).toFixed(2)}</p>
          <p className="mt-2 text-xs text-slate-500">Ingresos netos registrados</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ventas de hoy</p>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-100">{estadisticas?.ventasHoy ?? ventasHoyData.length}</p>
          <p className="mt-2 text-xs text-emerald-400">S/ {Number(estadisticas?.ingresosHoy ?? ingresosHoy).toFixed(2)} recaudados hoy</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Stock para venta</p>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-100">{estadisticas?.stockDisponible ?? stockDisponible}</p>
          <p className="mt-2 text-xs text-slate-500">{compradores.length} clientes registrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Ingresos diarios</h2>
              <p className="mt-1 text-xs text-slate-500">Últimos siete días</p>
            </div>
            <span className="text-xs text-slate-500">S/ {maxIngresos.toFixed(2)} máx.</span>
          </div>
          <svg viewBox="0 0 600 150" role="img" aria-label="Gráfico de ingresos diarios de los últimos siete días" className="mt-4 h-40 w-full overflow-visible">
            <path d="M30 130 H570" stroke="#334155" strokeWidth="1" />
            <polyline points={grafica} fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {dias.map((dia, index) => (
              <text key={`${dia.label}-${index}`} x={30 + index * 90} y="148" textAnchor="middle" fill="#64748b" fontSize="11">{dia.label}</text>
            ))}
          </svg>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-100">Acciones rápidas</h2>
          <div className="grid gap-3">
            <Link href="/admin/inventario" className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700">
              <span className="text-sm font-medium text-slate-100">Cargar inventario</span>
              <span className="mt-1 block text-xs text-slate-500">Agregar cuentas y administrar stock</span>
            </Link>
            <Link href="/admin/pedidos" className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700">
              <span className="text-sm font-medium text-slate-100">Revisar pedidos</span>
              <span className="mt-1 block text-xs text-slate-500">Validar comprobantes y despachar</span>
            </Link>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-100">Últimas ventas</h2>
          <ul className="space-y-3 text-xs">
            {ultimasVentas.map((venta) => (
              <li key={venta.id} className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800">
                <div>
                  <p className="font-bold text-white">
                    {compradores.find((comprador) => comprador.id === venta.compradorId)?.nombreCompleto ?? 'Comprador'}
                  </p>
                  <p className="text-gray-500">{new Date(venta.fechaVenta).toLocaleString()}</p>
                </div>
                <span className="font-extrabold text-green-400">S/ {Number(venta.precioPagado).toFixed(2)}</span>
              </li>
            ))}
            {ultimasVentas.length === 0 && <li className="text-gray-500">Aún no hay ventas.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}