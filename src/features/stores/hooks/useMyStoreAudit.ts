'use client';
import { useQuery } from '@tanstack/react-query';
import { STORES_QUERY_KEY } from '../constants/stores.constants';
import { storesService } from '../services/stores.service';

export function useMyStoreAudit() {
  return useQuery({
    queryKey: [...STORES_QUERY_KEY, 'mine', 'audit'],
    queryFn: storesService.listMyAudit,
  });
}
