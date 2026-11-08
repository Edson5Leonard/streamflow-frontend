import { Minus, Plus, Trash2 } from 'lucide-react';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { formatCurrency } from '@/utils/format-currency';
import { StoreSleeve } from './StoreSleeve';

export function CartServiceLine({ product, quantity, full, change, fixed = false }: {
  product: StoreProduct; quantity: number; full: boolean; change: (delta: number) => void; fixed?: boolean;
}) {
  return (
    <li className="sf-cart-line">
      <div className="sf-cart-thumb"><StoreSleeve category={product.categoria} /></div>
      <div className="sf-cart-description">
        <h3>{product.nombre}</h3><p>{formatCurrency(product.precio)} por unidad</p>
        {quantity > product.stockDisponible && <p role="alert">Stock actual: {product.stockDisponible}. Ajusta tu selección.</p>}
        {!fixed && <div className="sf-cart-stepper">
          <button type="button" aria-label={'Quitar una unidad de ' + product.nombre} onClick={() => change(-1)}><Minus size={15} /></button>
          <span>{quantity}</span>
          <button type="button" aria-label={'Añadir una unidad de ' + product.nombre}
            disabled={full || quantity >= product.stockDisponible} onClick={() => change(1)}><Plus size={15} /></button>
        </div>}
      </div>
      <div className="sf-cart-line-end">
        <strong>{formatCurrency(product.precio * quantity)}</strong>
        {!fixed && <button type="button" aria-label={'Eliminar ' + product.nombre} onClick={() => change(-quantity)}><Trash2 size={16} /></button>}
      </div>
    </li>
  );
}
