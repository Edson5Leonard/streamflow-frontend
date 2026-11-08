'use client';

import { Mail, Phone, ShieldCheck } from 'lucide-react';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { getInitials } from '@/utils/get-initials';
import { SlideIn } from '@/components/animation/SlideIn';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';

export default function SuperAdminProfile() {
  const profile = useProfile();
  if (profile.isLoading) return <LoadingState label="Cargando tu perfil" />;
  if (profile.error || !profile.data) return <ErrorState description={profile.error?.message} onRetry={() => void profile.refetch()} />;
  const user = profile.data;
  return (
    <div className="space-y-6">
      <header className="sf-network-cover">
        <SlideIn className="sf-network-copy">
          <h1>Mi perfil</h1><p>{user.nombreCompleto}</p>
        </SlideIn>
        <span className="sf-avatar sf-avatar-large" aria-hidden="true">{getInitials(user.nombreCompleto)}</span>
      </header>
      <SlideIn className="sf-network-panel">
        <h2>Datos de la cuenta</h2>
        <dl className="sf-profile-details">
          <div><Mail size={18} /><dt>Correo electrónico</dt><dd>{user.correo}</dd></div>
          <div><Phone size={18} /><dt>WhatsApp</dt><dd>{user.whatsapp || 'No registrado'}</dd></div>
          <div><ShieldCheck size={18} /><dt>Rol</dt><dd>{user.role.replace(/^ROLE_/, '') === 'SUPER_ADMIN' ? 'Superadministrador' : user.role}</dd></div>
        </dl>
      </SlideIn>
    </div>
  );
}
