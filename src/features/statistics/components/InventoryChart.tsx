'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReducedMotion } from 'motion/react';
import { formatStatus } from '@/utils/format-status';
import type { InventoryPoint } from '../types/statistics.types';
export function InventoryChart({ data }: { data: InventoryPoint[] }) {
  const reduced = useReducedMotion();
  return <section className="min-w-0 rounded-2xl border bg-card p-5"><h2 className="font-bold">Inventario</h2><p className="mt-1 text-sm text-muted-foreground">Cuentas por estado actual</p>{!data.length ? <p className="py-12 text-center text-sm text-muted-foreground">No hay cuentas en el inventario.</p> : <div className="mt-5 h-64" role="img" aria-label="Gráfico de cuentas por estado"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="estado" tickFormatter={formatStatus} tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} /><Tooltip labelFormatter={(value) => formatStatus(String(value))} contentStyle={{ background: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)', borderRadius: 12 }} /><Bar dataKey="cantidad" name="Cuentas" fill="#8b5cf6" radius={[5, 5, 0, 0]} isAnimationActive={!reduced} animationDuration={300} /></BarChart></ResponsiveContainer></div>}</section>;
}
