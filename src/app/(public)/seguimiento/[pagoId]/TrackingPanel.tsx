'use client';

import Link from 'next/link';
import { usePublicTracking } from '@/features/payments/hooks/usePublicTracking';
import { PaymentStatusBadge } from '@/features/payments/components/PaymentStatusBadge';
import { SaleDetail } from '@/features/sales/components/SaleDetail';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { trackingHref, type OrderLink } from '../../components/tracking-links';
import { PublicClaimForm } from '../../tiendas/[distribuidorId]/components/PublicClaimForm';
import { PurchaseConfirmation } from '../../components/PurchaseConfirmation';

export function TrackingPanel({ id, token, orders }: { id: string; token: string; orders: OrderLink[] }) {
  const query = usePublicTracking(id, token);
  const payment = query.data;
  return <section className="mx-auto max-w-3xl space-y-6">
    <Link href="/" className="text-sm text-muted-foreground hover:underline">← Tiendas</Link>
    <h1 className="text-3xl font-bold tracking-tight">Seguimiento de tu pedido</h1>
    <p className="text-sm text-muted-foreground">Guarda este enlace privado para consultar tu pedido.</p>
    {orders.length > 1 && <nav aria-label="Pedidos del carrito" className="flex flex-wrap gap-2">
      {orders.map((order,i) => <Link key={order.id} href={trackingHref(order, orders)} aria-current={id === order.id ? 'page' : undefined}
        className="rounded-full border px-3 py-2 text-sm aria-[current=page]:bg-violet-600 aria-[current=page]:text-white">
        {i+1}. {order.nombreServicio || 'Pedido'}
      </Link>)}
    </nav>}
    {query.isLoading && <LoadingState label="Consultando pedido"/>}
    {query.error && <ErrorState description={query.error.message} onRetry={() => void query.refetch()}/>}
    {payment && <>
      <PurchaseConfirmation id={id} />
      <div className="space-y-3 rounded-2xl border bg-card p-6">
        <PaymentStatusBadge status={payment.estado}/>
        <p>{payment.estado === 'PENDIENTE' ? 'El distribuidor está revisando tu comprobante.' :
          payment.estado === 'RECHAZADO' ? payment.motivoRechazo || 'El distribuidor rechazó el pago.' :
          payment.compra ? 'Tu cuenta está disponible.' : 'Pago aprobado. La entrega está pendiente.'}</p>
        <button disabled={query.isFetching} onClick={() => void query.refetch()} className="text-sm font-semibold text-violet-600 dark:text-violet-300">Actualizar estado</button>
      </div>
      {payment.estado === 'APROBADO' && payment.compra && <>
        <SaleDetail purchase={payment.compra}/>
        {payment.garantiaUsada ? <p>La garantía de esta compra ya fue utilizada.</p> : <PublicClaimForm pagoId={id} token={token}/>}
      </>}
    </>}
  </section>;
}
