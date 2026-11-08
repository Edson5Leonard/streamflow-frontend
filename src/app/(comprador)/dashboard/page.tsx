'use client';

import { useProfile } from '@/features/auth/hooks/useProfile';
import { useMyPurchases } from '@/features/sales/hooks/useMyPurchases';
import { useMyOrders } from '@/features/payments/hooks/useMyOrders';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { BuyerDashboardHeader } from './componentes/BuyerDashboardHeader';
import { BuyerStats } from './componentes/BuyerStats';
import { BuyerQuickActions } from './componentes/BuyerQuickActions';
import { RecentPurchases } from './componentes/RecentPurchases';

export default function BuyerDashboard() {
  const profile = useProfile();
  const purchases = useMyPurchases();
  const orders = useMyOrders();
  if (profile.isLoading || purchases.isLoading || orders.isLoading) return <LoadingState label="Cargando tu panel" />;
  const error = profile.error ?? purchases.error ?? orders.error;
  if (error) return <ErrorState description={error.message} onRetry={() => {
    void profile.refetch(); void purchases.refetch(); void orders.refetch();
  }} />;
  return (
    <div className="sf-buyer-stack">
      <BuyerDashboardHeader name={profile.data?.nombreCompleto ?? 'comprador'} />
      <BuyerStats purchases={purchases.data?.length ?? 0} orders={orders.data?.length ?? 0}
        pending={orders.data?.filter(order => order.estado === 'PENDIENTE').length ?? 0} />
      <RecentPurchases purchases={purchases.data ?? []} />
      <BuyerQuickActions />
    </div>
  );
}
