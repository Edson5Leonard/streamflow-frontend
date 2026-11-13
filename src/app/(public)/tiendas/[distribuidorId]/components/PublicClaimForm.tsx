'use client';
import { useState } from 'react';
import { ClaimForm } from '@/features/claims/components/ClaimForm';
import { AutoGuaranteeResultCard } from '@/features/claims/components/AutoGuaranteeResultCard';
import type { AutoGuaranteeResult } from '@/features/claims/types/claims.types';

export function PublicClaimForm({ pagoId, token }: { pagoId: string; token: string }) {
  const [result, setResult] = useState<AutoGuaranteeResult | null>(null);
  if (result) return <AutoGuaranteeResultCard result={result} />;
  return <details className="rounded-2xl border p-4">
    <summary className="cursor-pointer font-semibold">Reportar un problema con la cuenta</summary>
    <ClaimForm publicOrder={{ pagoId, token }} onSuccess={setResult}/>
  </details>;
}
