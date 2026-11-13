import Image from 'next/image';
import { PAYMENT_METHODS } from '../constants/payments.constants';
import { wallets } from '../constants/payment-destinations';
import type { PaymentMethod } from '../types/payments.types';

export function PaymentMethodSelector({ value, onChange, mostrarPlin = true, allowedMethods }: {
  value: PaymentMethod; onChange: (method: PaymentMethod) => void; mostrarPlin?: boolean; allowedMethods?: PaymentMethod[];
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">Método de pago</legend>
      <div className="flex flex-wrap gap-2">
        {PAYMENT_METHODS.filter(method => (mostrarPlin || method !== 'PLIN')
          && (!allowedMethods || allowedMethods.includes(method))).map(method => {
          const wallet = method === 'YAPE' || method === 'PLIN' ? wallets[method] : undefined;
          return (
            <label key={method} className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition focus-within:ring-2 focus-within:ring-violet-400 ${value === method ? 'border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-300' : 'border-border text-muted-foreground hover:border-violet-400'}`}>
              <input className="sr-only" type="radio" name="payment-method" value={method}
                checked={value === method} onChange={() => onChange(method)} />
              {wallet && <Image src={wallet.logo} alt="" width={24} height={24} className="size-6 rounded-md object-contain" />}
              {wallet?.name ?? (method === 'INTERNACIONAL' ? 'Internacional' : method)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
