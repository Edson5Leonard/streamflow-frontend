'use client';
import { useState, type FormEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
import { PaymentMethodSelector } from '@/features/payments/components/PaymentMethodSelector';
import { FileUploader } from '@/components/forms/FileUploader';
import { formatCurrency } from '@/utils/format-currency';
import type { PaymentMethod } from '@/features/payments/types/payments.types';
import { membershipPaymentSchema } from '../schemas/membership.schema';
import { MEMBERSHIP_AMOUNT } from '../constants/memberships.constants';
import { useCreateMembershipPayment } from '../hooks/useCreateMembershipPayment';
import type { Membership } from '../types/memberships.types';
export function MembershipPaymentForm({ onSuccess }: { onSuccess?: (membership: Membership) => void }) {
  const [method, setMethod] = useState<PaymentMethod>('YAPE'); const [code, setCode] = useState(''); const [file, setFile] = useState<File | null>(null); const [error, setError] = useState(''); const payment = useCreateMembershipPayment();
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); const parsed = membershipPaymentSchema.safeParse({ metodoPago: method, codigoOperacion: code, comprobante: file }); if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Revisa los datos del pago.'); return; } try { const result = await payment.mutateAsync(parsed.data); setCode(''); setFile(null); onSuccess?.(result); } catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo enviar el pago.'); } }
  return <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">Membresía</p><h2 className="mt-2 text-xl font-bold">Enviar pago</h2><p className="mt-1 text-sm text-muted-foreground">Monto de la membresía: {formatCurrency(MEMBERSHIP_AMOUNT)}.</p></div><PaymentMethodSelector value={method} onChange={setMethod} /><p className="text-sm text-muted-foreground">Solicita los datos de pago al administrador y adjunta el comprobante.</p><label className="block text-sm font-medium">Código de operación {method === 'INTERNACIONAL' && '(opcional)'}<input value={code} onChange={(event) => setCode(event.target.value)} maxLength={100} className="mt-1.5 h-11 w-full rounded-xl border bg-background px-3" /></label><FileUploader file={file} onFileChange={setFile} accept="image/png,image/jpeg,image/webp,application/pdf" maxSizeMb={5} label="Adjunta el comprobante" />{error && <p role="alert" className="text-sm text-red-500">{error}</p>}<button type="submit" disabled={payment.isPending} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{payment.isPending && <LoaderCircle size={16} className="animate-spin" />}{payment.isPending ? 'Enviando...' : 'Enviar comprobante'}</button></form>;
}
