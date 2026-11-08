import { StatusBadge } from '@/components/data-display/StatusBadge';
export function MembershipStateLabel({ status }: { status: string }) { return <StatusBadge status={status} />; }
