'use client';

import { FadeIn } from '@/components/animation/FadeIn';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { usePendingClaims } from '@/features/claims/hooks/usePendingClaims';
import { useSales } from '@/features/sales/hooks/useSales';
import { useDistributorStatistics } from '@/features/statistics/hooks/useDistributorStatistics';
import { DistributorDashboardHeader } from './componentes/DistributorDashboardHeader';
import { DistributorStats } from './componentes/DistributorStats';
import { InventorySummary } from './componentes/InventorySummary';
import { PendingActions } from './componentes/PendingActions';
import { SalesChart } from './componentes/SalesChart';

export default function DistributorDashboard() {
  const profile = useProfile();
  const stats = useDistributorStatistics();
  const sales = useSales();
  const accounts = useAccounts();
  const claims = usePendingClaims();
  const loading = profile.isLoading || stats.isLoading || sales.isLoading || accounts.isLoading || claims.isLoading;
  const error = profile.error ?? stats.error ?? sales.error ?? accounts.error ?? claims.error;

  if (loading) return <LoadingState label="Cargando resumen" />;
  if (error) {
    return (
      <ErrorState
        description={error.message}
        onRetry={() => {
          void profile.refetch();
          void stats.refetch();
          void sales.refetch();
          void accounts.refetch();
          void claims.refetch();
        }}
      />
    );
  }

  const pending = stats.data?.pagosPorRevisar ?? 0;
  return (
    <FadeIn className="space-y-6">
      <DistributorDashboardHeader pending={pending} name={profile.data?.nombreCompleto ?? 'distribuidor'} />
      {stats.data && <DistributorStats data={stats.data} />}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SalesChart sales={sales.data ?? []} />
        <div className="space-y-5">
          <InventorySummary
            available={stats.data?.stockDisponible ?? 0}
            warranty={accounts.data?.filter((account) => account.tipoStock === 'GARANTIA' && account.estado === 'DISPONIBLE').length ?? 0}
          />
          <PendingActions orders={pending} claims={claims.data?.length ?? 0} />
        </div>
      </div>
    </FadeIn>
  );
}
