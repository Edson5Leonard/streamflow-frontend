'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMyPurchases } from '@/features/sales/hooks/useMyPurchases';
import { ClaimForm } from '@/features/claims/components/ClaimForm';
import { AutoGuaranteeResultCard } from '@/features/claims/components/AutoGuaranteeResultCard';
import type { AutoGuaranteeResult } from '@/features/claims/types/claims.types';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { SlideIn } from '@/components/animation/SlideIn';
import { formatDate } from '@/utils/format-date';
import { BuyerCover } from '../componentes/BuyerCover';

export default function BuyerSupport() {
  const purchases = useMyPurchases();
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState<AutoGuaranteeResult | null>(null);
  const purchase = purchases.data?.find(item => item.id === selected);
  return (
    <div className="sf-buyer-stack">
      <BuyerCover view="support" title="Soporte y garantías" description="Reporta el problema y, si hay stock de garantía, recibirás un reemplazo de inmediato." />
      {purchases.isLoading ? <LoadingState /> : purchases.error ? <ErrorState description={purchases.error.message} onRetry={() => void purchases.refetch()} /> :
        !purchases.data?.length ? <EmptyState title="Aún no tienes compras entregadas" description="Puedes consultar el estado de tus pedidos en el historial."
          action={<Link href="/dashboard/historial">Ir al historial →</Link>} /> : (
          <div className="sf-buyer-columns">
            <section className="sf-buyer-panel">
              <h2>Elige una compra</h2>
              <label className="sf-buyer-field">Servicio entregado
                <select value={selected} onChange={event => { setSelected(event.target.value); setResult(null); }}>
                  <option value="">Selecciona tu compra</option>
                  {purchases.data.map(item => <option key={item.id} value={item.id}>{item.servicio} · {formatDate(item.fechaVenta)} · {item.correo}</option>)}
                </select>
              </label>
              {purchase && <div className="sf-buyer-purchase-info"><strong>{purchase.servicio}</strong><small>Entregado el {formatDate(purchase.fechaVenta)}</small></div>}
            </section>
            {result ? <div className="space-y-4"><AutoGuaranteeResultCard result={result} /><button onClick={() => { setResult(null); setSelected(''); }}>Elegir otra compra</button></div> :
              purchase ? <SlideIn key={purchase.id}><ClaimForm ventaId={purchase.id} onSuccess={setResult} /></SlideIn> :
              <div className="sf-buyer-panel"><h2>Detalles del reclamo</h2><p>Al elegir una compra podrás indicar la categoría del problema, describir lo ocurrido y adjuntar una evidencia.</p></div>}
          </div>
        )}
    </div>
  );
}
