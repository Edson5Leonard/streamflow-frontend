'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import type { PaymentMethod } from '@/features/payments/types/payments.types';
import { env } from '@/config/env';
import { formatCurrency } from '@/utils/format-currency';

type PurchaseSummary = {
  ids: string[]; store: string; customer: string; phone: string;
  method: PaymentMethod; operation: string; total: number; items: string[];
};

// Keep only the latest confirmation in this tab. Files and tracking tokens stay out of it.
export const useConfirmation = create<{ latest: PurchaseSummary | null; save: (summary: PurchaseSummary) => void }>()(
  persist(set => ({ latest: null, save: latest => set({ latest }) }), {
    name: 'streamflow:latest-confirmation', storage: createJSONStorage(() => sessionStorage),
  }),
);

function whatsappNumber(raw: string | null) {
  const digits = raw?.replace(/\D/g, '') ?? '';
  if (/^9\d{8}$/.test(digits)) return '51' + digits;
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : '';
}

export function PurchaseConfirmation({ id }: { id: string }) {
  const receipt = useConfirmation(state => state.latest);
  if (!receipt?.ids.includes(id)) return null;
  const recipient = whatsappNumber(env.whatsappNumber);
  const text = [
    `Registré un pedido en ${receipt.store}.`,
    `Nombre: ${receipt.customer}`, `WhatsApp: ${receipt.phone}`,
    ...receipt.items, `Total: ${formatCurrency(receipt.total)}`,
    `Método: ${receipt.method}`, receipt.operation && `Código de operación: ${receipt.operation}`,
    `Pedidos: ${receipt.ids.join(', ')}`,
    'Adjunté el comprobante en la web para su revisión.',
  ].filter(Boolean).join('\n');
  const href = `https://wa.me/${recipient}?text=${encodeURIComponent(text)}`;
  return (
    <section className="space-y-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold"><CheckCircle2 size={20} /> Pedido registrado</h2>
      <p className="text-sm">{receipt.items.join(' · ')} · {formatCurrency(receipt.total)}</p>
      {recipient ? <a href={href} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
        <MessageCircle size={17} /> Enviar mensaje por WhatsApp
      </a> : <p role="alert" className="text-sm text-destructive">El número de WhatsApp de destino no es válido.</p>}
      <p className="text-xs text-muted-foreground">
        {recipient ? `Destino: +${recipient}. ` : ''}Revisa el mensaje en WhatsApp antes de enviarlo.
      </p>
    </section>
  );
}
