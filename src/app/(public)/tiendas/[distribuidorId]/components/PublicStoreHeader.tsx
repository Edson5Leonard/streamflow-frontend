import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, MessageCircle } from 'lucide-react';
import { SlideIn } from '@/components/animation/SlideIn';
import { authUrl } from '@/features/auth/constants/auth.routes';
import type { StoreCatalog } from '@/features/stores/types/stores.types';

export function PublicStoreHeader({ catalog, id }: { catalog: StoreCatalog; id: string }) {
  const phone = catalog.whatsapp?.replace(/\D/g, '');
  const available = catalog.productos.filter(product => product.stockDisponible > 0).length;
  return (
    <header className="sf-shop-hero">
      <SlideIn className="sf-shop-intro">
        <Link href="/#tiendas" className="sf-shop-back"><ArrowLeft size={15} /> Todas las tiendas</Link>
        <h1>{catalog.nombreTienda}</h1>
        <p>Consulta el catálogo y arma tu pedido con los servicios de esta tienda.</p>
        <div className="sf-shop-actions">
          <a href="#catalogo" className="sf-shop-primary">Ver catálogo <ArrowUpRight size={16} /></a>
          <Link href={authUrl('/registro', id)}>Registrarme</Link>
          <Link href={authUrl('/login', id)}>Ingresar a mi cuenta</Link>
          {phone && <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp</a>}
        </div>
      </SlideIn>
      <SlideIn direction="left" className="sf-shop-ticket">
        <span>Catálogo de la tienda</span>
        <strong>{String(available).padStart(2, '0')}</strong>
        <span>{available === 1 ? 'servicio disponible' : 'servicios disponibles'}</span>
        <i aria-hidden="true" />
      </SlideIn>
    </header>
  );
}
