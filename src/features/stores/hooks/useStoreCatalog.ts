'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { storesService } from '../services/stores.service';
import { STORE_CATALOG_QUERY_KEY } from '../constants/stores.constants';

export function useStoreCatalog(distributorId: string) {
  const queryClient = useQueryClient();
  const queryKey = [...STORE_CATALOG_QUERY_KEY, distributorId];
  const query = useQuery({
    queryKey,
    queryFn: () => storesService.getCatalog(distributorId),
    enabled: Boolean(distributorId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!distributorId || env.useMocks) return;
    const events = new EventSource(`${env.apiUrl}/tiendas/${encodeURIComponent(distributorId)}/eventos`);
    events.addEventListener('store-updated', () => {
      void queryClient.invalidateQueries({ queryKey: [...STORE_CATALOG_QUERY_KEY, distributorId] });
    });
    return () => events.close();
  }, [distributorId, queryClient]);

  return query;
}
