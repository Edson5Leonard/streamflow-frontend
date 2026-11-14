'use client';

import { useState } from 'react';
import { PurchaseHistory } from '@/features/sales/components/PurchaseHistory';
import { useMyOrders } from '@/features/payments/hooks/useMyOrders';
import { PaymentStatusBadge } from '@/features/payments/components/PaymentStatusBadge';
import type { PaymentStatus } from '@/features/payments/types/payments.types';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SlideIn } from '@/components/animation/SlideIn';
import { BuyerCover } from '../componentes/BuyerCover';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { ClientPortal } from '@/app/cliente/portal/ClientPortal';

const filters = { TODOS: 'Todos', PENDIENTE: 'Pendientes', APROBADO: 'Aprobados', RECHAZADO: 'Rechazados' } as const;
export default function BuyerHistory() {
  const profile = useProfile();
  if (profile.data?.pinDebeCambiar !== undefined) return <ClientPortal embedded />;
  return <RegisteredBuyerHistory />;
}

function RegisteredBuyerHistory() {
  const orders = useMyOrders();
  const [status, setStatus] = useState<PaymentStatus | 'TODOS'>('TODOS');
  const visible = (orders.data ?? []).filter(order => status === 'TODOS' || order.estado === status)
    .sort((a,b) => Date.parse(b.fechaSolicitud) - Date.parse(a.fechaSolicitud));
  return (
    <div className="sf-buyer-stack">
      <BuyerCover view="history" title="Mis compras" description="Consulta la revisión de tus pagos y los datos de los servicios que ya recibiste.">
        <a className="sf-buyer-primary" href="#entregas">Ver servicios entregados ↓</a>
      </BuyerCover>
      <section id="pedidos" className="sf-buyer-panel scroll-mt-24">
        <h2>Pedidos y pagos</h2>
        <div className="sf-buyer-filters" aria-label="Filtrar pedidos por estado">
          {(Object.keys(filters) as (keyof typeof filters)[]).map(key => (
            <button key={key} aria-pressed={status === key} onClick={() => setStatus(key)}>{filters[key]}</button>
          ))}
        </div>
        {orders.isLoading ? <LoadingState /> : orders.error ? <ErrorState description={orders.error.message} onRetry={() => void orders.refetch()} /> :
          visible.length ? visible.map((order,index) => (
            <SlideIn key={order.id} delay={Math.min(index,3) * .04} className="sf-buyer-order">
              <div><strong>{order.servicio}</strong><small>{formatDate(order.fechaSolicitud)} · {order.id.slice(0,8)}</small></div>
              <b>{formatCurrency(order.monto)}</b><PaymentStatusBadge status={order.estado} />
              {order.motivoRechazo && <p>Motivo del rechazo: {order.motivoRechazo}</p>}
            </SlideIn>
          )) : <EmptyState title={status === 'TODOS' ? 'Aún no tienes pedidos registrados' : 'No hay pedidos con este estado'} />}
      </section>
      <section id="entregas" className="scroll-mt-24 space-y-4">
        <h2>Servicios entregados</h2><PurchaseHistory />
      </section>
    </div>
  );
}
