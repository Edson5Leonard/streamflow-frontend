import { Check, Plus } from 'lucide-react';
import { AnimatedCard } from '@/components/animation/AnimatedCard';
import { formatCurrency } from '@/utils/format-currency';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { getProductPlanSummary } from '@/features/stores/utils/stores.utils';
import { StoreSleeve } from './StoreSleeve';

type Props = { product: StoreProduct; quantity: number; full: boolean; onAdd: (product: StoreProduct) => void; onBuy: (product: StoreProduct) => void };

export function PublicProductCard({ product, quantity, full, onAdd, onBuy }: Props) {
  const available = product.stockDisponible > 0;
  const limited = quantity >= product.stockDisponible;
  const label = !available ? 'Agotado' : limited ? 'Stock máximo' : full ? 'Carrito completo' : 'Agregar al carrito';
  const planSummary = getProductPlanSummary(product);
  return (
    <AnimatedCard lift={3} className="h-full">
      <article className="sf-shop-card">
        <StoreSleeve category={product.categoria} imageUrl={product.imagenUrl} />
        <div className="sf-shop-card-body">
          <h3>{product.nombre}</h3>
          {product.descripcion && <p>{product.descripcion}</p>}
          {planSummary && <p className="sf-shop-plan-details">{planSummary}</p>}
          <div className="sf-shop-price">
            <strong>{formatCurrency(product.precio)}</strong>
            <span>{available ? `${product.stockDisponible} en stock` : 'Sin stock'}</span>
          </div>
          <button type="button" disabled={!available} aria-label={'Comprar · ' + product.nombre} onClick={() => onBuy(product)}>Comprar</button>
          <button className="sf-shop-add" type="button" disabled={limited || full} onClick={() => onAdd(product)}
            aria-label={`${label} · ${product.nombre}`}>
            {quantity ? <Check size={16} /> : <Plus size={16} />}
            {label}{quantity > 0 && ` · ${quantity} en carrito`}
          </button>
        </div>
      </article>
    </AnimatedCard>
  );
}
