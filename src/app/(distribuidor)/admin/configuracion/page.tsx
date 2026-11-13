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
import { useMyStore } from '@/features/stores/hooks/useMyStore';
import { useMyStoreAudit } from '@/features/stores/hooks/useMyStoreAudit';
import { StoreSettingsForm } from './StoreSettingsForm';

const subscribe = () => () => {};
export default function SettingsPage() {
  const profile = useProfile();
  const store = useMyStore();
  const audit = useMyStoreAudit();
  const origin = useSyncExternalStore(subscribe, () => window.location.origin, () => '');
  if (profile.isLoading || store.isLoading || audit.isLoading) return <LoadingState />;
  const error = profile.error ?? store.error ?? audit.error;
  if (error || !profile.data || !store.data) return <ErrorState description={error?.message} onRetry={() => { void profile.refetch(); void store.refetch(); void audit.refetch(); }} />;
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
    <StoreSettingsForm store={store.data} />
    <section className="sf-dist-panel space-y-3">
      <h2>Cambios recientes</h2>
      {audit.data?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
        <thead><tr><th className="p-2">Fecha</th><th className="p-2">Campo</th><th className="p-2">Anterior</th><th className="p-2">Nuevo</th></tr></thead>
        <tbody>{audit.data.map(item => <tr key={item.id} className="border-t">
          <td className="p-2">{new Date(item.fecha).toLocaleString('es-PE')}</td><td className="p-2">{item.campo}</td>
          <td className="max-w-48 truncate p-2">{item.valorAnterior ?? '—'}</td><td className="max-w-48 truncate p-2">{item.valorNuevo ?? '—'}</td>
        </tr>)}</tbody>
      </table></div> : <p className="text-sm text-muted-foreground">Aún no hay cambios auditados.</p>}
    </section>
  </div>;
}
