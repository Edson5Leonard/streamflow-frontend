'use client';

import Link from 'next/link';
import { ArrowUpRight, Mail, Phone, Store } from 'lucide-react';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { getStoreHref } from '@/features/stores/utils/stores.utils';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { SlideIn } from '@/components/animation/SlideIn';
import { getInitials } from '@/utils/get-initials';
import { BuyerCover } from '../componentes/BuyerCover';

export default function BuyerProfile() {
  const profile = useProfile();
  if (profile.isLoading) return <LoadingState />;
  if (profile.error || !profile.data) return <ErrorState description={profile.error?.message} onRetry={() => void profile.refetch()} />;
  const user = profile.data;
  const phone = user.distribuidorWhatsapp?.replace(/\D/g, '');
  return (
    <div className="sf-buyer-stack">
      <BuyerCover view="profile" title="Mi perfil" description="Revisa los datos de tu cuenta y accede a tu tienda vinculada." />
      <div className="sf-buyer-columns">
        <SlideIn className="sf-buyer-panel">
          <div className="sf-buyer-identity"><span>{getInitials(user.nombreCompleto)}</span><div><h2>{user.nombreCompleto}</h2><small>Comprador</small></div></div>
          <dl>
            <div className="sf-buyer-row"><Mail size={18} /><div><dt>Correo</dt><dd>{user.correo || 'No registrado'}</dd></div></div>
            <div className="sf-buyer-row"><Phone size={18} /><div><dt>WhatsApp</dt><dd>{user.whatsapp || 'No registrado'}</dd></div></div>
          </dl>
        </SlideIn>
        <SlideIn delay={.06} className="sf-buyer-panel"><Store size={24} /><h2 className="mt-4">Tu distribuidor</h2>
          <p>{user.distribuidorId ? 'Tu tienda gestiona tus pedidos y puede ayudarte a actualizar los datos de tu cuenta.' : 'No tienes una tienda vinculada.'}</p>
          <div className="sf-buyer-links">
            {user.distribuidorId && <Link href={getStoreHref(user.distribuidorId)}>Visitar mi tienda <ArrowUpRight size={15} /></Link>}
            {phone && <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp ↗</a>}
          </div>
        </SlideIn>
      </div>
    </div>
  );
}
