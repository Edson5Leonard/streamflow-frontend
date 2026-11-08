'use client';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReducedMotion } from 'motion/react';
import { formatCurrency } from '@/utils/format-currency';
import type { SalesPoint } from '../types/statistics.types';
export function RevenueChart({ data }: { data: SalesPoint[] }) {
  const reduced = useReducedMotion();
  return <section className="min-w-0 rounded-2xl border bg-card p-5"><h2 className="font-bold">Ingresos por ventas</h2><p className="mt-1 text-sm text-muted-foreground">Montos registrados por período</p>{!data.length ? <p className="py-12 text-center text-sm text-muted-foreground">No hay datos para mostrar.</p> : <div className="mt-5 h-64" role="img" aria-label="Gráfico de ingresos por ventas"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="fecha" tick={{ fontSize: 11 }} minTickGap={20} /><YAxis tick={{ fontSize: 11 }} width={45} /><Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} contentStyle={{ background: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)', borderRadius: 12 }} /><Area dataKey="ingresos" name="Ingresos" stroke="#7c3aed" fill="#a78bfa" fillOpacity={0.25} strokeWidth={2} isAnimationActive={!reduced} animationDuration={300} /></AreaChart></ResponsiveContainer></div>}</section>;
}
