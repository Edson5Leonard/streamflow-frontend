'use client';

import { useState } from 'react';
import { StoreCatalog } from '@/features/stores/components/StoreCatalog';
import { useStoreCatalog } from '@/features/stores/hooks/useStoreCatalog';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { PublicStoreHeader } from './PublicStoreHeader';
import { PublicProductCard } from './PublicProductCard';
import { PublicCart } from './PublicCart';
import './storefront.css';

export function PublicStoreCatalog({ distributorId }: { distributorId: string }) {
  const catalog = useStoreCatalog(distributorId);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState('');
  const count = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

  function change(product: StoreProduct, delta: number) {
    setQuantities(previous => {
      const current = previous[product.servicioId] ?? 0;
      const units = Object.values(previous).reduce((sum, quantity) => sum + quantity, 0);
      if (delta > 0 && (current >= product.stockDisponible || units >= 20)) return previous;
      return { ...previous, [product.servicioId]: Math.max(0, current + delta) };
    });
    setMessage(`${product.nombre}: carrito actualizado.`);
  }

  return (
    <div className="sf-shop">
      {catalog.data && <>
        <PublicStoreHeader id={distributorId} catalog={catalog.data} />
        <PublicCart distributorId={distributorId} products={catalog.data.productos}
          quantities={quantities} change={change} />
      </>}
      <p role="status" className="sr-only">{message}</p>
      <div id="catalogo" className="scroll-mt-40">
        <StoreCatalog loading={catalog.isLoading} catalog={catalog.data} error={catalog.error?.message}
          onRetry={() => void catalog.refetch()}
          renderProduct={product => (
            <PublicProductCard product={product} quantity={quantities[product.servicioId] ?? 0}
              full={count >= 20} onAdd={item => change(item, 1)} />
          )} />
      </div>
    </div>
  );
}
