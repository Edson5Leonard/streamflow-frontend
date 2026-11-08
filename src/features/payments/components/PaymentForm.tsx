'use client';
import { useState, type FormEvent } from 'react';
import { LoaderCircle, Send } from 'lucide-react';
import { useCreatePayment } from '../hooks/useCreatePayment';
import { paymentSchema, publicPaymentSchema } from '../schemas/payment.schema';
import type { Payment, PaymentMethod, PaymentSubmission } from '../types/payments.types';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentInstructions } from './PaymentInstructions';
import { VoucherUploader } from './VoucherUploader';
import { PaymentInstructions as RealInstructions } from '@/components/payments/PaymentInstructions';
import { env } from '@/config/env';

export function PaymentForm({ servicioId, distribuidorId, onSuccess }: { servicioId: string; distribuidorId?: string; onSuccess?: (result: Payment | PaymentSubmission) => void }) {
  const [method, setMethod] = useState<PaymentMethod>('YAPE'); const [file, setFile] = useState<File | null>(null); const [nombre, setNombre] = useState(''); const [whatsapp, setWhatsapp] = useState(''); const [codigo, setCodigo] = useState(''); const [error, setError] = useState('');
  const mutation = useCreatePayment();
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    if (method !== 'INTERNACIONAL' && !codigo.trim()) { setError('Ingresa el código de operación.'); return; }
    const input = { servicioId, metodoPago: method, codigoOperacion: codigo, comprobante: file };
    const parsed = distribuidorId ? publicPaymentSchema.safeParse({ ...input, distribuidorId, nombreCompleto: nombre, whatsapp }) : paymentSchema.safeParse(input);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Revisa los datos del pago.'); return; }
    try { const result = await mutation.mutateAsync(parsed.data); onSuccess?.(result); } catch { /* mutation exposes the error */ }
  }
  const inputClass = 'mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-slate-900';
  return <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">Finalizar pedido</p><h2 className="mt-2 text-xl font-bold">Información de pago</h2><p className="mt-1 text-sm text-muted-foreground">Tu comprobante será revisado por el distribuidor.</p></div>{distribuidorId && <><label className="block text-sm font-medium">Nombre completo<input value={nombre} onChange={(event) => setNombre(event.target.value)} autoComplete="name" className={inputClass} /></label><label className="block text-sm font-medium">WhatsApp<input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} autoComplete="tel" className={inputClass} /></label></>}{env.useMocks ? <><PaymentMethodSelector value={method} onChange={setMethod} /><PaymentInstructions method={method} /><p className="text-xs text-muted-foreground">Modo de prueba. Utiliza un comprobante de ejemplo.</p></> : <RealInstructions metodo={method} onMetodoChange={setMethod} />}<label className="block text-sm font-medium">Código de operación {method === 'INTERNACIONAL' && <span className="font-normal text-muted-foreground">(opcional)</span>}<input value={codigo} onChange={(event) => setCodigo(event.target.value)} maxLength={100} className={inputClass} /></label><VoucherUploader file={file} onChange={setFile} />{(error || mutation.error) && <p role="alert" className="text-sm text-red-500">{error || mutation.error?.message}</p>}<button disabled={mutation.isPending} type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50">{mutation.isPending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}{mutation.isPending ? 'Enviando...' : 'Enviar comprobante'}</button></form>;
}
