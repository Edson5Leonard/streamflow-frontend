import { Check, Plus } from 'lucide-react';
import { AnimatedCard } from '@/components/animation/AnimatedCard';
import { formatCurrency } from '@/utils/format-currency';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { StoreSleeve } from './StoreSleeve';

type Props = { product: StoreProduct; quantity: number; full: boolean; onAdd: (product: StoreProduct) => void };

export function PublicProductCard({ product, quantity, full, onAdd }: Props) {
  const available = product.stockDisponible > 0;
  const limited = quantity >= product.stockDisponible;
  const label = !available ? 'Agotado' : limited ? 'Stock máximo' : full ? 'Carrito completo' : 'Agregar';
  return (
    <AnimatedCard lift={3} className="h-full">
      <article className="sf-shop-card">
        <StoreSleeve category={product.categoria} />
        <div className="sf-shop-card-body">
          <h3>{product.nombre}</h3>
          {product.descripcion && <p>{product.descripcion}</p>}
          <div className="sf-shop-price">
            <strong>{formatCurrency(product.precio)}</strong>
            <span>{available ? `${product.stockDisponible} en stock` : 'Sin stock'}</span>
          </div>
          <button type="button" disabled={limited || full} onClick={() => onAdd(product)}
            aria-label={`${label} · ${product.nombre}`}>
            {quantity ? <Check size={16} /> : <Plus size={16} />}
            {label}{quantity > 0 && ` · ${quantity} en carrito`}
          </button>
        </div>
      </article>
    </AnimatedCard>
  );
}
