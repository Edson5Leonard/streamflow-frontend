'use client';
import { motion, useReducedMotion } from 'motion/react';
import { BadgeCheck } from 'lucide-react';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Membership } from '../types/memberships.types';
import { MembershipStatusBadge } from './MembershipStatusBadge';
export function MembershipCard({ membership, onSelect }: { membership: Membership; onSelect?: (membership: Membership) => void }) { const reduced = useReducedMotion(); return <motion.article whileHover={reduced ? undefined : { y: -3 }} transition={{ duration: 0.22 }} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300"><BadgeCheck size={21} /></span><MembershipStatusBadge status={membership.estado} /></div><h3 className="mt-4 font-bold">Membresía · {formatCurrency(membership.monto)}</h3><p className="mt-1 text-sm text-muted-foreground">Solicitud del {formatDate(membership.fechaSolicitud)}</p>{membership.fechaVencimiento && <p className="mt-2 text-sm text-muted-foreground">Vigente hasta {formatDate(membership.fechaVencimiento)}</p>}{membership.motivoRechazo && <p className="mt-2 text-sm text-red-500">{membership.motivoRechazo}</p>}{onSelect && <button type="button" onClick={() => onSelect(membership)} className="mt-4 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300">Ver solicitud →</button>}</motion.article>; }
