'use client';
import { PackagePlus } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Replenishment } from '../types/replenishments.types';
import { ReplenishmentStatusBadge } from './ReplenishmentStatusBadge';
export function ReplenishmentCard({ request, onSelect }: { request: Replenishment; onSelect?: (request: Replenishment) => void }) { const reduced = useReducedMotion(); return <motion.article whileHover={reduced ? undefined : { y: -3 }} transition={{ duration: 0.22 }} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-2"><span className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300"><PackagePlus size={21} /></span><ReplenishmentStatusBadge status={request.estado} /></div><h3 className="mt-4 font-bold">{request.nombreServicio}</h3><p className="mt-1 text-sm text-muted-foreground">{request.unidadesSolicitadas} unidades · {formatDate(request.fechaCreacion)}</p><p className="mt-3 text-lg font-bold text-violet-600 dark:text-violet-300">{formatCurrency(request.montoCotizado)}</p>{request.notaAdmin && <p className="mt-2 text-xs text-muted-foreground">{request.notaAdmin}</p>}{onSelect && <button type="button" onClick={() => onSelect(request)} className="mt-4 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300">Ver solicitud →</button>}</motion.article>; }
