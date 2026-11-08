'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { ExternalLink } from 'lucide-react';
import { CopyButton } from '@/components/data-display/CopyButton';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { getStoreHref } from '@/features/stores/utils/stores.utils';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { SlideIn } from '@/components/animation/SlideIn';
import { DistributorCover } from '../componentes/DistributorCover';

const subscribe = () => () => {};
export default function SettingsPage() {
  const profile = useProfile();
  const origin = useSyncExternalStore(subscribe, () => window.location.origin, () => '');
  if (profile.isLoading) return <LoadingState />;
  if (profile.error || !profile.data) return <ErrorState description={profile.error?.message} onRetry={() => void profile.refetch()} />;
  const user = profile.data;
  const path = getStoreHref(user.usuarioId);
  return <div className="sf-dist-stack">
    <DistributorCover title="Configuración" description="Consulta los datos de tu cuenta y comparte la dirección de tu tienda." value="Tienda" label="perfil de distribuidor" />
    <div className="sf-dist-columns">
      <SlideIn className="sf-dist-panel"><h2>Datos de cuenta</h2>
        <dl>{[['Nombre',user.nombreCompleto],['Correo',user.correo],['WhatsApp',user.whatsapp || 'No registrado']].map(([label,value]) =>
          <div className="sf-dist-detail" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p>Para actualizar estos datos, contacta al administrador.</p>
      </SlideIn>
      <SlideIn delay={.05} className="sf-dist-panel">
        <h2>Enlace público</h2><p>Comparte este enlace con tus compradores para que puedan abrir el catálogo de tu tienda.</p>
        <div className="sf-dist-url"><span>{origin}{path}</span>{origin && <CopyButton value={origin + path} />}</div>
        <Link className="sf-dist-action" href={path}>Abrir mi tienda <ExternalLink size={15} /></Link>
      </SlideIn>
    </div>
  </div>;
}
