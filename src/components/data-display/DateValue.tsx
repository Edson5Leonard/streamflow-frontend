import { formatDate } from '@/utils/format-date';

export function DateValue({ value, format = 'dd MMM yyyy', className }: { value: string | Date; format?: string; className?: string }) { return <time className={className} dateTime={value instanceof Date ? value.toISOString() : value}>{formatDate(value, format)}</time>; }
