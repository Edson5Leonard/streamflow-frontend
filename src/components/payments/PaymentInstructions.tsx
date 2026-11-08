'use client';

import { PaymentMethodSelector } from '@/features/payments/components/PaymentMethodSelector';
import { PaymentInstructions as Destination } from '@/features/payments/components/PaymentInstructions';
import type { PaymentMethod } from '@/features/payments/types/payments.types';
import { env } from '@/config/env';

export type MetodoPago = PaymentMethod;

export function PaymentInstructions({ metodo, onMetodoChange, mostrarPlin = true }: {
  metodo: PaymentMethod; onMetodoChange: (method: PaymentMethod) => void; mostrarPlin?: boolean;
}) {
  return (
    <section className="min-w-0 space-y-3">
      <PaymentMethodSelector value={metodo} onChange={onMetodoChange} mostrarPlin={mostrarPlin} />
      {env.useMocks && <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
        Modo de prueba. Adjunta un comprobante de ejemplo sin realizar una transferencia.
      </p>}
      <Destination key={metodo} method={metodo} />
    </section>
  );
}
