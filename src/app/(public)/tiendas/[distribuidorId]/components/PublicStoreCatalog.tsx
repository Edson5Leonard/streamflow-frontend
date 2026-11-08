'use client';

import { useState } from 'react';
import { StoreCatalog } from '@/features/stores/components/StoreCatalog';
import { useStoreCatalog } from '@/features/stores/hooks/useStoreCatalog';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { PublicStoreHeader } from './PublicStoreHeader';
import { PublicProductCard } from './PublicProductCard';
import { FloatingCartLink } from './FloatingCartLink';
import { CheckoutContents } from './PublicCart';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CART_LIMIT, useCartItems, useCartStore } from '@/stores/cart.store';
import './storefront.css';

export function PublicStoreCatalog({ distributorId }: { distributorId: string }) {
  const catalog = useStoreCatalog(distributorId);
  const quantities = useCartItems(distributorId);
  const update = useCartStore(state => state.change);
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<{ serviceId?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const count = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

  function change(product: StoreProduct, delta: number) {
    update(distributorId, product.servicioId, delta, product.stockDisponible);
    setMessage(`${product.nombre}: carrito actualizado.`);
    setMode({});
  }

  return (
    <div className="sf-shop">
      {catalog.data && <>
        <PublicStoreHeader id={distributorId} catalog={catalog.data} />
        <FloatingCartLink storeId={distributorId} count={count} />
      </>}
      <p role="status" className="sr-only">{message}</p>
      <div id="catalogo" className="scroll-mt-40">
        <StoreCatalog loading={catalog.isLoading} catalog={catalog.data} error={catalog.error?.message}
          onRetry={() => void catalog.refetch()}
          renderProduct={product => (
            <PublicProductCard product={product} quantity={quantities[product.servicioId] ?? 0}
              full={count >= CART_LIMIT} onAdd={item => change(item, 1)} onBuy={item => setMode({ serviceId: item.servicioId })} />
          )} />
      </div>
      <Dialog open={mode !== null} onOpenChange={open => { if (!open && !busy) setMode(null); }}>
        {mode && catalog.data && <DialogContent showCloseButton={!busy} className="sf-quick-checkout">
          <DialogTitle>{mode.serviceId ? 'Comprar servicio' : 'Pagar el carrito'}</DialogTitle>
          <DialogDescription>{catalog.data.nombreTienda}</DialogDescription>
          <CheckoutContents distributorId={distributorId} catalog={catalog.data} modal
            singleId={mode.serviceId} onBusy={setBusy} onContinue={() => setMode(null)} />
        </DialogContent>}
      </Dialog>
    </div>
  );
}
