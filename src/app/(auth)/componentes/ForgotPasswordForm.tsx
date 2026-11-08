import Link from 'next/link';
import { ArrowUpRight, LifeBuoy } from 'lucide-react';
import { getStoreHref } from '@/features/stores/utils/stores.utils';

export function ForgotPasswordForm({ distributorId }: { distributorId?: string }) {
  return (
    <div className="sf-auth-notice">
      <LifeBuoy size={22} aria-hidden="true" />
      <h2>Contacta a tu distribuidor</h2>
      <p>La recuperación automática aún no está disponible. Abre tu tienda para consultar sus opciones de contacto.</p>
      <Link className="sf-auth-action" href={distributorId ? getStoreHref(distributorId) : '/#tiendas'}>
        {distributorId ? 'Ir a mi tienda' : 'Buscar mi tienda'} <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
