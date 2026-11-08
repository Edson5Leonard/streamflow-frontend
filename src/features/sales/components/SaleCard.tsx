'use client';
import { Clapperboard, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Purchase } from '../types/sales.types';

export function SaleCard({ purchase, onSelect }: { purchase: Purchase; onSelect?: (purchase: Purchase) => void }) {
  const reduced = useReducedMotion();
  return <motion.article whileHover={reduced ? undefined : { y: -4 }} transition={{ duration: 0.22 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"><div className="flex items-center justify-between bg-gradient-to-br from-[#16133e] to-[#5331a4] p-5 text-white"><span className="grid size-12 place-items-center rounded-xl border border-white/20 bg-white/10"><Clapperboard size={22} /></span><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Compra entregada</span></div><div className="space-y-3 p-5"><h3 className="text-lg font-bold">{purchase.servicio}</h3><p className="text-sm text-slate-500 dark:text-slate-400">Comprado el {formatDate(purchase.fechaVenta)}</p><p className="font-bold text-violet-700 dark:text-violet-300">{formatCurrency(purchase.precioPagado)}</p>{onSelect && <button type="button" onClick={() => onSelect(purchase)} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400">Ver credenciales <ArrowUpRight size={15} /></button>}</div></motion.article>;
}
