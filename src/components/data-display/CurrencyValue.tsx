import { formatCurrency } from '@/utils/format-currency';

export function CurrencyValue({ value, currency = 'PEN', className }: { value: number; currency?: string; className?: string }) { return <span className={className}>{formatCurrency(value, currency)}</span>; }
