'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePendingClaims } from '@/features/claims/hooks/usePendingClaims';
import { ClaimTable } from '@/features/claims/components/ClaimTable';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { DistributorCover } from '../componentes/DistributorCover';

export default function DistributorAudit() {
  const claims = usePendingClaims();
  if (claims.isLoading) return <LoadingState />;
  if (claims.error) return <ErrorState description={claims.error.message} onRetry={() => void claims.refetch()} />;
  const pending = [...(claims.data ?? [])].sort((a,b) => a.fechaCreacion.localeCompare(b.fechaCreacion));
  return <div className="sf-dist-stack">
    <DistributorCover title="Auditoría" description="Consulta los reclamos pendientes de tu tienda. El administrador revisa las cuentas observadas."
      value={pending.length} label="pendientes de atención" />
    <section className="sf-dist-panel">
      <div className="sf-dist-heading"><div><h2>Cola de revisión</h2><p>Los reclamos más antiguos aparecen primero.</p></div>
        <Link className="sf-dist-action" href="/admin/reclamos">Gestionar reclamos <ArrowRight size={15} /></Link></div>
      <ClaimTable claims={pending} />
    </section>
  </div>;
}
