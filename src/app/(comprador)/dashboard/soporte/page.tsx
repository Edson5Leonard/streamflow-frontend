'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { claimsApi } from '@/features/claims/api/claims.api';
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
import { useProfile } from '@/features/auth/hooks/useProfile';
import { ClientPortal } from '@/app/cliente/portal/ClientPortal';

export default function BuyerSupport() {
  const profile = useProfile();
  if (profile.data?.pinDebeCambiar !== undefined) return <ClientPortal embedded />;
  return <RegisteredBuyerSupport />;
}

function RegisteredBuyerSupport() {
  const purchases = useMyPurchases();
  const myClaims = useQuery({ queryKey: ['my-claims'], queryFn: claimsApi.listMine });
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
              purchase ? <SlideIn key={purchase.id}><ClaimForm ventaId={purchase.id} onSuccess={(res) => { setResult(res); void myClaims.refetch(); }} /></SlideIn> :
              <div className="sf-buyer-panel"><h2>Detalles del reclamo</h2><p>Al elegir una compra podrás indicar la categoría del problema, describir lo ocurrido y adjuntar una evidencia.</p></div>}
          </div>
        )}

      <section className="sf-buyer-panel space-y-3">
        <h2>Mis reclamos</h2>
        {myClaims.isLoading ? <LoadingState label="Cargando tus reclamos" /> :
          !myClaims.data?.length ? <p className="text-sm opacity-75">Aún no has enviado reclamos.</p> : (
            <div className="space-y-3">
              {myClaims.data.map((claim) => (
                <div key={claim.id} className="rounded-xl border p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>{claim.servicio ?? 'Reclamo'} · {claim.categoriaFallo}</strong>
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold border">
                      {claim.estado}
                    </span>
                  </div>
                  <p className="text-sm opacity-80">{claim.motivo}</p>
                  <small className="block opacity-60">{formatDate(claim.fechaCreacion)}</small>
                  {claim.reemplazo && (
                    <div className="mt-2 rounded-lg border bg-emerald-500/10 p-3 text-sm space-y-1">
                      <p className="font-semibold text-emerald-400">Cuenta de reemplazo asignada:</p>
                      <p>Correo: <code>{claim.reemplazo.correo}</code></p>
                      <p>Contraseña: <code>{claim.reemplazo.password}</code></p>
                      {claim.reemplazo.perfilPin && <p>Perfil / PIN: <code>{claim.reemplazo.perfilPin}</code></p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </section>
    </div>
  );
}
