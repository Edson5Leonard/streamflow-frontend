'use client';
import { useState } from 'react';
import { ClaimForm } from '@/features/claims/components/ClaimForm';

export function PublicClaimForm({ pagoId, token }: { pagoId: string; token: string }) {
  const [sent, setSent] = useState(false);
  if (sent) return <p role="status">Tu reclamo se envió al distribuidor.</p>;
  return <details className="rounded-2xl border p-4">
    <summary className="cursor-pointer font-semibold">Reportar un problema con la cuenta</summary>
    <ClaimForm publicOrder={{ pagoId, token }} onSuccess={() => setSent(true)}/>
  </details>;
}
