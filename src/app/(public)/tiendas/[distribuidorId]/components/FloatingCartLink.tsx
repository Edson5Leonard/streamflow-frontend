import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { getStoreHref } from '@/features/stores/utils/stores.utils';

export function FloatingCartLink({ storeId, count }: { storeId: string; count: number }) {
  return (
    <Link href={getStoreHref(storeId) + '/carrito'} className="sf-cart-fab"
      aria-label={`Ver carrito · ${count} ${count === 1 ? 'unidad' : 'unidades'}`} title="Ver carrito">
      <ShoppingCart size={24} aria-hidden="true" />
      <span key={count} aria-hidden="true">{count}</span>
    </Link>
  );
}
