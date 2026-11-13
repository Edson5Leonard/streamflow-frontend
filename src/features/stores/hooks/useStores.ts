'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { storesService } from '../services/stores.service';
import { STORES_QUERY_KEY } from '../constants/stores.constants';

export function useStores() {
  const queryClient = useQueryClient();
  const queryKey = [...STORES_QUERY_KEY, 'available'];
  const query = useQuery({ queryKey, queryFn: storesService.listAvailable, staleTime: 0, refetchOnWindowFocus: true });
  useEffect(() => {
    if (env.useMocks) return;
    const source = new EventSource(`${env.apiUrl}/tiendas/eventos`);
    source.addEventListener('store-updated', () => {
      void queryClient.invalidateQueries({ queryKey: [...STORES_QUERY_KEY, 'available'] });
    });
    return () => source.close();
  }, [queryClient]);
  return query;
}
