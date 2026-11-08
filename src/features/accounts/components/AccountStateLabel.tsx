import { formatStatus } from '@/utils/format-status';
export function AccountStateLabel({ status }: { status: string }) { return <span>{formatStatus(status)}</span>; }
