'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

export function ClientDashboardGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const profile = useProfile();

  useEffect(() => {
    if (profile.data?.pinDebeCambiar) router.replace('/cliente/portal');
  }, [profile.data?.pinDebeCambiar, router]);

  if (profile.isLoading || profile.data?.pinDebeCambiar) return <LoadingState />;
  if (profile.error || !profile.data) return <ErrorState description={profile.error?.message} onRetry={() => void profile.refetch()} />;
  return children;
}
