'use client';
import { useState } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useMyPurchases } from '../hooks/useMyPurchases';
import type { Purchase } from '../types/sales.types';
import { SaleCard } from './SaleCard';
import { SaleDetail } from './SaleDetail';
export function PurchaseHistory() {
  const { data, isLoading, error, refetch } = useMyPurchases(); const [selected, setSelected] = useState<Purchase | null>(null);
  if (isLoading) return <LoadingState label="Cargando compras" />;
  if (error) return <ErrorState description={error.message} onRetry={() => void refetch()} />;
  if (!data?.length) return <EmptyState title="Aún no tienes compras" description="Tus compras aparecerán aquí cuando se entreguen." />;
  return <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.map((purchase) => <SaleCard key={purchase.id} purchase={purchase} onSelect={setSelected} />)}</div><Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="sm:max-w-lg"><DialogTitle>Detalle de compra</DialogTitle><DialogDescription>Consulta los datos de tu servicio.</DialogDescription>{selected && <SaleDetail purchase={selected} />}</DialogContent></Dialog></>;
}
