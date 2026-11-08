'use client';
import { Clapperboard, Music2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { formatCurrency } from '@/utils/format-currency';
import type { Service } from '../types/services.types';
import { ServiceCategoryBadge } from './ServiceCategoryBadge';

export function ServiceCard({ service, onSelect }: { service: Service; onSelect?: (service: Service) => void }) {
  const reduced = useReducedMotion(); const Icon = service.categoria.toLowerCase().includes('música') ? Music2 : Clapperboard;
  return <motion.article whileHover={reduced ? undefined : { y: -4 }} transition={{ duration: 0.22 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"><div className="grid h-36 place-items-center bg-gradient-to-br from-[#16133e] via-[#28205b] to-[#5331a4]"><span className="grid size-16 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white"><Icon size={27} /></span></div><div className="space-y-3 p-5"><div className="flex items-center justify-between gap-2"><ServiceCategoryBadge category={service.categoria} /><span className={`text-xs font-medium ${service.activo ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{service.activo ? 'Activo' : 'Inactivo'}</span></div><h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.nombre}</h3><p className="min-h-10 text-sm text-slate-500 dark:text-slate-400">{service.descripcion || 'Servicio digital de entretenimiento.'}</p><div><p className="text-xs text-slate-400">Precio mayorista</p><p className="text-lg font-bold text-violet-700 dark:text-violet-300">{formatCurrency(service.precioMayorista)}</p></div>{onSelect && <button type="button" onClick={() => onSelect(service)} className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700">Ver servicio</button>}</div></motion.article>;
}
