'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReducedMotion } from 'motion/react';
import type { SalesPoint } from '../types/statistics.types';
export function SalesChart({ data }: { data: SalesPoint[] }) {
  const reduced = useReducedMotion();
  return <section className="min-w-0 rounded-2xl border bg-card p-5"><h2 className="font-bold">Ventas</h2><p className="mt-1 text-sm text-muted-foreground">Cantidad de ventas por período</p>{!data.length ? <p className="py-12 text-center text-sm text-muted-foreground">No hay datos para mostrar.</p> : <div className="mt-5 h-64" role="img" aria-label="Gráfico de cantidad de ventas por período"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="fecha" tick={{ fontSize: 11 }} minTickGap={20} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} /><Tooltip contentStyle={{ background: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)', borderRadius: 12 }} /><Bar dataKey="ventas" name="Ventas" fill="#7c3aed" radius={[5, 5, 0, 0]} isAnimationActive={!reduced} animationDuration={300} /></BarChart></ResponsiveContainer></div>}</section>;
}
