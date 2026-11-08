import type { MembershipStatus } from '../types/memberships.types';
const labels: Record<MembershipStatus, string> = { PENDIENTE: 'Pendiente', APROBADO: 'Aprobado', RECHAZADO: 'Rechazado' };
const colors: Record<MembershipStatus, string> = { PENDIENTE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', APROBADO: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', RECHAZADO: 'bg-red-500/10 text-red-700 dark:text-red-300' };
export function MembershipStatusBadge({ status }: { status: MembershipStatus }) { return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}>{labels[status]}</span>; }
