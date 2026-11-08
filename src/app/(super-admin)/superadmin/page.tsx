'use client';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { useGlobalStatistics } from '@/features/statistics/hooks/useGlobalStatistics';
import { useSales } from '@/features/sales/hooks/useSales';
import { useMemberships } from '@/features/memberships/hooks/useMemberships';
import { useReplenishments } from '@/features/replenishments/hooks/useReplenishments';
import { useAudit } from '@/features/audit/hooks/useAudit';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { FadeIn } from '@/components/animation/FadeIn';
import { SuperAdminHeader } from './componentes/SuperAdminHeader';
import { GlobalStats } from './componentes/GlobalStats';
import { GlobalSalesChart } from './componentes/GlobalSalesChart';
import { SystemHealth } from './componentes/SystemHealth';
export default function SuperAdminPage() { const profile = useProfile(); const stats = useGlobalStatistics(); const sales = useSales(); const memberships = useMemberships(); const replenishments = useReplenishments(); const audit = useAudit(); const queries = [profile, stats, sales, memberships, replenishments, audit]; if (queries.some((query) => query.isLoading)) return <LoadingState />; const error = queries.find((query) => query.error)?.error; if (error) return <ErrorState description={error.message} onRetry={() => { queries.forEach((query) => void query.refetch()); }} />; return <FadeIn className="space-y-6"><SuperAdminHeader active={stats.data?.distribuidoresActivos ?? 0} name={profile.data?.nombreCompleto ?? 'administrador'} />{stats.data && <GlobalStats data={stats.data} />}<div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><GlobalSalesChart sales={sales.data ?? []} /><SystemHealth memberships={memberships.data?.length ?? 0} replenishments={replenishments.data?.filter((item) => item.estado === 'PAGO_PENDIENTE' || item.estado === 'PAGO_APROBADO').length ?? 0} claims={audit.data?.length ?? 0} /></div></FadeIn>; }
