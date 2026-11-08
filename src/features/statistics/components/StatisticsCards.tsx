import { CircleDollarSign, PackageCheck, ShoppingBag, Store, Wallet } from 'lucide-react';
import { StatCard } from '@/components/data-display/StatCard';
import { formatCurrency } from '@/utils/format-currency';
import type { DistributorStatistics, GlobalStatistics } from '../types/statistics.types';

export function StatisticsCards({ data, variant }: { data: DistributorStatistics; variant: 'distributor' } | { data: GlobalStatistics; variant: 'global' }) {
  const cards = variant === 'distributor' ? [
    { label: 'Ingresos totales', value: formatCurrency(data.ingresosTotales), icon: CircleDollarSign },
    { label: 'Ingresos de hoy', value: formatCurrency(data.ingresosHoy), icon: Wallet },
    { label: 'Ventas de hoy', value: data.ventasHoy, icon: ShoppingBag },
    { label: 'Stock disponible', value: data.stockDisponible, icon: PackageCheck },
  ] : [
    { label: 'Ingresos de la red', value: formatCurrency(data.ingresosRed), icon: CircleDollarSign },
    { label: 'Ingresos por membresías', value: formatCurrency(data.ingresosMembresias), icon: Wallet },
    { label: 'Ventas de hoy', value: data.ventasHoy, icon: ShoppingBag },
    { label: 'Distribuidores activos', value: data.distribuidoresActivos, icon: Store },
    { label: 'Distribuidores suspendidos', value: data.distribuidoresSuspendidos, icon: Store },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <StatCard key={card.label} {...card} />)}</div>;
}
