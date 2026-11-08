'use client';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { useDistributorStatistics } from '@/features/statistics/hooks/useDistributorStatistics';
import { useSales } from '@/features/sales/hooks/useSales';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { usePayments } from '@/features/payments/hooks/usePayments';
import { usePendingClaims } from '@/features/claims/hooks/usePendingClaims';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { FadeIn } from '@/components/animation/FadeIn';
import { DistributorDashboardHeader } from './componentes/DistributorDashboardHeader';
import { DistributorStats } from './componentes/DistributorStats';
import { SalesChart } from './componentes/SalesChart';
import { InventorySummary } from './componentes/InventorySummary';
import { PendingActions } from './componentes/PendingActions';
export default function DistributorDashboard() { const profile = useProfile(); const stats = useDistributorStatistics(); const sales = useSales(); const accounts = useAccounts(); const payments = usePayments(profile.data?.usuarioId ?? ''); const claims = usePendingClaims(); const loading = profile.isLoading || stats.isLoading || sales.isLoading || accounts.isLoading || claims.isLoading || (!!profile.data && payments.isLoading); const error = profile.error ?? stats.error ?? sales.error ?? accounts.error ?? claims.error ?? payments.error; if (loading) return <LoadingState label="Cargando resumen" />; if (error) return <ErrorState description={error.message} onRetry={() => { void profile.refetch(); void stats.refetch(); void sales.refetch(); void accounts.refetch(); void claims.refetch(); if (profile.data) void payments.refetch(); }} />; return <FadeIn className="space-y-6"><DistributorDashboardHeader pending={payments.data?.filter(payment => payment.estado === 'PENDIENTE').length ?? 0} name={profile.data?.nombreCompleto ?? 'distribuidor'} />{stats.data && <DistributorStats data={stats.data} />}<div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><SalesChart sales={sales.data ?? []} /><div className="space-y-5"><InventorySummary available={stats.data?.stockDisponible ?? 0} warranty={accounts.data?.filter((a) => a.tipoStock === 'GARANTIA' && a.estado === 'DISPONIBLE').length ?? 0} /><PendingActions orders={payments.data?.filter((payment) => payment.estado === 'PENDIENTE').length ?? 0} claims={claims.data?.length ?? 0} /></div></div></FadeIn>; }
