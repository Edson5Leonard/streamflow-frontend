'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface EstadisticasGlobales {
  ingresosRed: number;
  ingresosMembresias: number;
  ventasHoy: number;
  distribuidoresActivos: number;
  distribuidoresSuspendidos: number;
}

export default function SuperAdminDashboard() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasGlobales | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.resolve()
      .then(() => fetchApi<EstadisticasGlobales>('/estadisticas/admin'))
      .then(setEstadisticas)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudieron cargar las métricas globales.'));
  }, []);

  const metricas = [
    {
      label: 'Distribuidores activos',
      value: estadisticas ? `${estadisticas.distribuidoresActivos}` : '—',
      detail: `${estadisticas?.distribuidoresSuspendidos ?? '—'} suspendidos`,
      color: 'text-emerald-400',
    },
    {
      label: 'Ingresos por membresías',
      value: `S/ ${Number(estadisticas?.ingresosMembresias ?? 0).toFixed(2)}`,
      detail: 'Pagos de S/ 30 aprobados',
      color: 'text-slate-100',
    },
    {
      label: 'Ingresos de la red',
      value: `S/ ${Number(estadisticas?.ingresosRed ?? 0).toFixed(2)}`,
      detail: `${estadisticas?.ventasHoy ?? 0} ventas registradas hoy`,
      color: 'text-slate-100',
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Resumen global</h1>
        <p className="mt-1 text-sm text-slate-400">Finanzas de la red y estado de las tiendas distribuidoras.</p>
      </header>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {metricas.map((metrica) => (
          <section key={metrica.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metrica.label}</p>
            <p className={`mt-3 text-2xl font-semibold tabular-nums ${metrica.color}`}>{metrica.value}</p>
            <p className="mt-2 text-xs text-slate-500">{metrica.detail}</p>
          </section>
        ))}
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-sm font-semibold text-slate-100">Actividad financiera</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Los importes reflejan ventas confirmadas y membresías aprobadas guardadas en la base de datos. Las solicitudes pendientes no se contabilizan como ingresos.
        </p>
      </section>
    </div>
  );
}
