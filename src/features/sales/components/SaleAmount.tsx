import { CurrencyValue } from '@/components/data-display/CurrencyValue';
export function SaleAmount({ amount }: { amount: number }) { return <CurrencyValue value={amount} />; }
