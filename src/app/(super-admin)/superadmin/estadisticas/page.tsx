'use client';

import { useEffect, useState } from 'react';
import { useGlobalStatistics } from '@/features/statistics/hooks/useGlobalStatistics';
import { useSales } from '@/features/sales/hooks/useSales';
import { useGlobalAccounts } from '@/features/accounts/hooks/useGlobalAccounts';
import { StatisticsCards } from '@/features/statistics/components/StatisticsCards';
import { StatisticsFilters } from '@/features/statistics/components/StatisticsFilters';
import { SalesChart } from '@/features/statistics/components/SalesChart';
import { RevenueChart } from '@/features/statistics/components/RevenueChart';
import { InventoryChart } from '@/features/statistics/components/InventoryChart';
import { buildInventorySeries, buildSalesSeries } from '@/features/statistics/utils/statistics.utils';
import type { StatisticsRange } from '@/features/statistics/types/statistics.types';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { formatCurrency } from '@/utils/format-currency';
import { NetworkCover } from '../componentes/NetworkCover';

export default function StatisticsPage() {
  const stats = useGlobalStatistics();
  const sales = useSales();
  const accounts = useGlobalAccounts();
  const [range, setRange] = useState<StatisticsRange>('30d');
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setNow(new Date()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (stats.isLoading || sales.isLoading || accounts.isLoading || !now) return <LoadingState />;
  const error = stats.error ?? sales.error ?? accounts.error;
  if (error) return <ErrorState description={error.message} onRetry={() => {
    void stats.refetch(); void sales.refetch(); void accounts.refetch();
  }} />;
  const series = buildSalesSeries(sales.data ?? [], range, now);
  const total = series.reduce((sum, point) => sum + point.ingresos, 0);
  return (
    <div className="space-y-6">
      <NetworkCover title="Estadísticas" description="Consulta la actividad de la red y el stock global actual."
        metric={formatCurrency(total)} label="ingresos del período elegido" />
      {stats.data && <StatisticsCards variant="global" data={stats.data} />}
      <section className="sf-network-panel space-y-4">
        <h2>Ventas e ingresos</h2>
        <StatisticsFilters value={range} onChange={setRange} />
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <SalesChart data={series} /><RevenueChart data={series} />
        </div>
      </section>
      <InventoryChart data={buildInventorySeries(accounts.data ?? [])} />
    </div>
  );
}
