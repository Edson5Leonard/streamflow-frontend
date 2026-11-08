'use client';

import { useState } from 'react';
import { StoreCatalog } from '@/features/stores/components/StoreCatalog';
import { useStoreCatalog } from '@/features/stores/hooks/useStoreCatalog';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { PublicStoreHeader } from './PublicStoreHeader';
import { PublicProductCard } from './PublicProductCard';
import { FloatingCartLink } from './FloatingCartLink';
import { CART_LIMIT, useCartItems, useCartStore } from '@/stores/cart.store';
import './storefront.css';

export function PublicStoreCatalog({ distributorId }: { distributorId: string }) {
  const catalog = useStoreCatalog(distributorId);
  const quantities = useCartItems(distributorId);
  const update = useCartStore(state => state.change);
  const [message, setMessage] = useState('');
  const count = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

  function change(product: StoreProduct, delta: number) {
    update(distributorId, product.servicioId, delta, product.stockDisponible);
    setMessage(`${product.nombre}: carrito actualizado.`);
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
              full={count >= CART_LIMIT} onAdd={item => change(item, 1)} />
          )} />
      </div>
    </div>
  );
}
