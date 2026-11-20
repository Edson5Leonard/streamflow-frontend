'use client';

import { useProfile } from '@/features/auth/hooks/useProfile';
import { ProfileEditorCard } from '@/features/profile/components/ProfileEditorCard';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';

export default function DistributorProfilePage() {
  const profile = useProfile();
  if (profile.isLoading) return <LoadingState label="Cargando tu perfil" />;
  if (profile.error || !profile.data) return <ErrorState description={profile.error?.message} onRetry={() => void profile.refetch()} />;
  const user = profile.data;
  return (
    <div className="space-y-6">
      <header className="sf-network-cover">
        <div className="sf-network-copy">
          <h1>Mi perfil</h1>
          <p>{user.nombreCompleto} · Distribuidor</p>
        </div>
      </header>
      <ProfileEditorCard
        initialName={user.nombreCompleto}
        initialEmail={user.correo}
        initialWhatsapp={user.whatsapp || ''}
        onUpdated={() => void profile.refetch()}
      />
    </div>
  );
}
