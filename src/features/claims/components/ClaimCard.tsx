'use client';
import { MessageSquareWarning } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { formatDate } from '@/utils/format-date';
import type { Claim } from '../types/claims.types';
import { ClaimStatusBadge } from './ClaimStatusBadge';
export function ClaimCard({ claim, onSelect }: { claim: Claim; onSelect?: (claim: Claim) => void }) { const reduced = useReducedMotion(); return <motion.article whileHover={reduced ? undefined : { y: -3 }} transition={{ duration: 0.22 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"><div className="flex items-start justify-between gap-2"><span className="grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"><MessageSquareWarning size={20} /></span><ClaimStatusBadge status={claim.estado} /></div><h3 className="mt-4 font-bold">{claim.categoriaFallo.replaceAll('_', ' ')}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{claim.motivo}</p><p className="mt-4 text-xs text-slate-400">{formatDate(claim.fechaCreacion)}</p>{onSelect && <button type="button" onClick={() => onSelect(claim)} className="mt-4 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400">Ver reclamo →</button>}</motion.article>; }
