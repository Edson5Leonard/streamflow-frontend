'use client';
import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { CopyButton } from '@/components/data-display/CopyButton';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Purchase } from '../types/sales.types';

export function SaleDetail({ purchase }: { purchase: Purchase }) {
  const [showPassword, setShowPassword] = useState(false);
  return <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Tu compra</p><h2 className="mt-2 text-xl font-bold">{purchase.servicio}</h2><p className="mt-1 text-sm text-slate-500">{formatDate(purchase.fechaVenta)} · {formatCurrency(purchase.precioPagado)}</p></div><ShieldCheck className="text-violet-500" size={22} /></div><div className="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-white/5"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs text-slate-500">Correo</p><p className="break-all text-sm font-medium">{purchase.correo}</p></div><CopyButton value={purchase.correo} /></div><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs text-slate-500">Contraseña</p><p className="text-sm font-medium">{showPassword ? purchase.password : '••••••••'}</p></div><div className="flex items-center"><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button><CopyButton value={purchase.password} /></div></div>{purchase.perfilPin && <div><p className="text-xs text-slate-500">Perfil / PIN</p><p className="text-sm font-medium">{purchase.perfilPin}</p></div>}</div><p className="text-xs text-slate-500">Mantén estos datos privados y consúltalos cuando los necesites.</p></section>;
}
