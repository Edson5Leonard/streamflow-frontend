'use client';

import { PaymentMethodSelector } from '@/features/payments/components/PaymentMethodSelector';
import { PaymentInstructions as Destination } from '@/features/payments/components/PaymentInstructions';
import type { PaymentMethod } from '@/features/payments/types/payments.types';
import { env } from '@/config/env';
import { CopyButton } from '@/components/data-display/CopyButton';
import Image from 'next/image';
import { getStoreImageSrc } from '@/features/stores/utils/stores.utils';
import type { StorePaymentMethod } from '@/features/stores/types/stores.types';

export type MetodoPago = PaymentMethod;

export function PaymentInstructions({ metodo, onMetodoChange, mostrarPlin = true, metodosTienda }: {
  metodo: PaymentMethod; onMetodoChange: (method: PaymentMethod) => void; mostrarPlin?: boolean;
  metodosTienda?: StorePaymentMethod[];
}) {
  const configured = metodosTienda?.filter(item => item.activo) ?? [];
  const demo = env.useMocks && metodosTienda !== undefined && configured.length === 0;
  const availableMethods = metodosTienda === undefined || demo
    ? undefined
    : configured.map(item => item.metodo);
  const selected = configured.find(item => item.metodo === metodo);
  return (
    <section className="min-w-0 space-y-3">
      {metodosTienda !== undefined && !demo && !configured.length
        ? <p role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">Esta tienda aún no configuró métodos de pago.</p>
        : <PaymentMethodSelector value={metodo} onChange={onMetodoChange} mostrarPlin={mostrarPlin} allowedMethods={availableMethods} />}
      {env.useMocks && <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
        Modo de prueba. Adjunta un comprobante de ejemplo sin realizar una transferencia.
      </p>}
      {metodosTienda === undefined ? <Destination key={metodo} method={metodo} /> : demo
        ? <p className="text-xs text-muted-foreground">Los datos de pago configurados por el distribuidor aparecerán aquí en la tienda real.</p>
        : selected && <StorePaymentDetails method={selected} />}
    </section>
  );
}

function StorePaymentDetails({ method }: { method: StorePaymentMethod }) {
  const image = getStoreImageSrc(method.imagenQrUrl);
  return <section className="min-w-0 space-y-3 rounded-2xl border bg-card p-4">
    <h3 className="font-semibold">{method.metodo === 'INTERNACIONAL' ? 'Pago internacional' : `Pago · ${method.metodo}`}</h3>
    {method.titular && <p className="text-sm text-muted-foreground">Titular: <strong className="text-foreground">{method.titular}</strong></p>}
    {image && <Image unoptimized src={image} alt={`QR de ${method.metodo}`} width={480} height={480} className="max-h-72 max-w-full rounded-xl bg-white p-2 object-contain" />}
    {method.numeroCuenta && <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-background p-3">
      <div><p className="text-xs text-muted-foreground">Número de cuenta / teléfono</p><p className="break-all font-mono text-sm font-semibold">{method.numeroCuenta}</p></div><CopyButton label="Copiar número" value={method.numeroCuenta} />
    </div>}
    {method.cci && <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-background p-3">
      <div><p className="text-xs text-muted-foreground">CCI</p><p className="break-all font-mono text-sm font-semibold">{method.cci}</p></div><CopyButton label="Copiar CCI" value={method.cci} />
    </div>}
  </section>;
}
