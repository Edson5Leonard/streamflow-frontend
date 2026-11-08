'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { useStoreCatalog } from '@/features/stores/hooks/useStoreCatalog';
import { StoreCatalog } from '@/features/stores/components/StoreCatalog';
import { BuyerServiceCard } from '../componentes/BuyerServiceCard';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { PaymentForm } from '@/features/payments/components/PaymentForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatCurrency } from '@/utils/format-currency';
import { BuyerCover } from '../componentes/BuyerCover';

export default function BuyerCatalog() {
  const profile = useProfile();
  const storeId = profile.data?.distribuidorId ?? '';
  const catalog = useStoreCatalog(storeId);
  const [selected, setSelected] = useState<StoreProduct | null>(null);
  const [sent, setSent] = useState(false);
  return (
    <div className="sf-buyer-stack">
      <BuyerCover view="catalog" title="Catálogo de servicios" description={catalog.data
        ? `Consulta los precios y el stock de ${catalog.data.nombreTienda}. Elige un servicio para solicitar tu compra.`
        : 'Encuentra un servicio en el catálogo de tu tienda.'} />
      {profile.isSuccess && !storeId ? <EmptyState title="Tu cuenta aún no tiene una tienda vinculada" /> : (
        <StoreCatalog catalog={catalog.data} loading={profile.isLoading || catalog.isLoading}
          error={profile.error?.message ?? catalog.error?.message}
          onRetry={() => { if (profile.error) void profile.refetch(); else void catalog.refetch(); }}
          renderProduct={product => <BuyerServiceCard product={product} onSelect={item => {
            setSent(false); setSelected(item);
          }} />} />
      )}
      <Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-lg">
          <DialogTitle>{selected?.nombre}</DialogTitle>
          <DialogDescription>{selected && formatCurrency(selected.precio)} · Solicitud de compra</DialogDescription>
          {sent ? <div role="status" className="sf-buyer-notice"><CheckCircle2 size={22} />
            <p>Tu pedido se envió al distribuidor para revisión.</p>
            <Link href="/dashboard/historial#pedidos">Consultar pedidos →</Link>
          </div> : selected && <PaymentForm servicioId={selected.servicioId} onSuccess={() => setSent(true)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
