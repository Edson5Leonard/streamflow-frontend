import { Disc3, Film, Plus } from 'lucide-react';
import { AnimatedCard } from '@/components/animation/AnimatedCard';
import { formatCurrency } from '@/utils/format-currency';
import type { StoreProduct } from '@/features/stores/types/stores.types';

export function BuyerServiceCard({ product, onSelect }: { product: StoreProduct; onSelect: (product: StoreProduct) => void }) {
  const music = product.categoria.toLocaleLowerCase('es').includes('música');
  const Icon = music ? Disc3 : Film;
  return <AnimatedCard lift={3} className="h-full">
    <article className="sf-buyer-service">
      <div className="sf-buyer-sleeve" data-music={music}><Icon size={26} /><span>{product.categoria}</span></div>
      <div className="sf-buyer-service-body">
        <h3>{product.nombre}</h3><p>{product.descripcion}</p>
        <div className="sf-buyer-price"><strong>{formatCurrency(product.precio)}</strong><small>{product.stockDisponible} en stock</small></div>
        <button disabled={!product.stockDisponible} onClick={() => onSelect(product)}>
          {product.stockDisponible > 0 ? <><Plus size={15} /> Solicitar compra</> : 'Agotado'}
        </button>
      </div>
    </article>
  </AnimatedCard>;
}
