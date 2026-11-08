import { StatusBadge } from '@/components/data-display/StatusBadge';
export function PaymentStateLabel({ status }: { status: string }) { return <StatusBadge status={status} />; }
