'use client';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';
import { formatDate } from '@/utils/format-date';
import type { AuditEvent } from '../types/audit.types';
import { AuditStatusBadge } from './AuditStatusBadge';
export function AuditEventCard({ event, onSelect }: { event: AuditEvent; onSelect?: (event: AuditEvent) => void }) { const reduced = useReducedMotion(); return <motion.article whileHover={reduced ? undefined : { y: -3 }} transition={{ duration: 0.22 }} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-2"><span className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300"><ShieldAlert size={21} /></span><AuditStatusBadge status={event.estado} /></div><h3 className="mt-4 font-bold">{event.categoriaFallo.replaceAll('_', ' ')}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.motivo}</p><p className="mt-3 text-xs text-muted-foreground">Venta {event.ventaId.slice(0, 8)} · {formatDate(event.fechaCreacion)}</p>{onSelect && <button type="button" onClick={() => onSelect(event)} className="mt-4 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300">Revisar →</button>}</motion.article>; }
