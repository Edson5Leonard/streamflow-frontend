'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { CopyButton } from '@/components/data-display/CopyButton';
import { banks, wallets } from '../constants/payment-destinations';
import type { PaymentMethod } from '../types/payments.types';

function BankNumber({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-background p-3">
    <div><p className="text-xs text-muted-foreground">{label}</p><p className="break-all font-mono text-sm font-semibold">{value}</p></div>
    <CopyButton label={`Copiar ${label}`} value={value} />
  </div>;
}

export function PaymentInstructions({ method }: { method: PaymentMethod }) {
  const [expanded, setExpanded] = useState(false);
  const [pais, setPais] = useState('MX');
  const panel = 'min-w-0 space-y-3 rounded-2xl border bg-card p-4';

  if (method === 'YAPE' || method === 'PLIN') {
    const wallet = wallets[method];
    return <section className={panel}>
      <h3 className="font-semibold">QR de {wallet.name}</h3>
      <p className="text-sm text-muted-foreground">Titular: <strong className="text-foreground">{wallet.holder}</strong></p>
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}
        className="flex max-w-full flex-col items-start gap-2 rounded-lg text-xs font-semibold">
        <Image unoptimized src={wallet.qr} alt={`Código QR de ${wallet.name} a nombre de ${wallet.holder}`}
          width={wallet.width} height={wallet.height}
          className={`h-auto max-w-full rounded-lg bg-white p-2 ${expanded ? 'w-80' : 'w-40'}`} />
        <span className="inline-flex items-center gap-1">
          {expanded ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
          {expanded ? 'Reducir QR' : 'Ampliar QR'}
        </span>
      </button>
    </section>;
  }

  if (method === 'BCP' || method === 'INTERBANK') {
    const bank = banks[method];
    return <section className={panel}>
      <h3 className="font-semibold">Transferencia a {bank.name}</h3>
      <p className="text-sm text-muted-foreground">Titular: {wallets.YAPE.holder}</p>
      <BankNumber label={bank.accountLabel} value={bank.account} />
      <BankNumber label={`CCI ${bank.name}`} value={bank.cci} />
    </section>;
  }

  return <section className={panel}>
    <label className="block text-sm font-semibold">País desde donde envías
      <select value={pais} onChange={event => setPais(event.target.value)} className="mt-2 block w-full rounded-xl border bg-background px-3 py-2">
        <option value="MX">México</option><option value="CO">Colombia</option><option value="EC">Ecuador</option>
      </select>
    </label>
    <ol className="list-inside list-decimal space-y-2 text-sm leading-6 text-muted-foreground">
            {pais === 'MX' && (
              <>
                <li>Abre Remitly o Wise y elige enviar dinero a Perú mediante depósito bancario.</li>
                <li>Ingresa Interbank como banco destino, el titular <strong>{wallets.YAPE.holder}</strong> y el CCI peruano de 20 dígitos.</li>
                <li>Envía en MXN, conserva el código de operación y adjunta el comprobante.</li>
              </>
            )}
            {pais === 'CO' && (
              <>
                <li>Abre Global66 o Wise y elige enviar dinero a Perú mediante depósito bancario.</li>
                <li>Ingresa Interbank como banco destino, el titular <strong>{wallets.YAPE.holder}</strong> y el CCI peruano de 20 dígitos.</li>
                <li>Paga desde tu cuenta o PSE, conserva el código de operación y adjunta el comprobante.</li>
              </>
            )}
            {pais === 'EC' && (
              <>
                <li>Elige Global66 para depósito bancario o realiza un giro por Western Union.</li>
                <li>Global66: envía USD a Interbank usando el CCI de abajo. Western Union: envía a nombre de <strong>{wallets.YAPE.holder}</strong>.</li>
                <li>Adjunta la captura del envío. Si usaste Western Union, incluye el código MTCN en el código de operación.</li>
              </>
            )}
          </ol>
    <p className="text-xs text-muted-foreground">Confirma en tu aplicación de envío que la opción de depósito a Perú esté disponible.</p>
    <p className="text-sm">Interbank (Perú) · {wallets.YAPE.holder}</p>
    <BankNumber label="CCI Interbank" value={banks.INTERBANK.cci} />
  </section>;
}
