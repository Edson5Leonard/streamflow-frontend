import { StatusBadge } from '@/components/data-display/StatusBadge';
export function ClaimStateLabel({ status }: { status: string }) { return <StatusBadge status={status} />; }
