'use client';
import { useQuery } from '@tanstack/react-query';
import { STORES_QUERY_KEY } from '../constants/stores.constants';
import { storesService } from '../services/stores.service';

export function useAdminStoreAudit(distributorId?: string) {
  return useQuery({
    queryKey: [...STORES_QUERY_KEY, 'admin', 'audit', distributorId ?? 'all'],
    queryFn: () => storesService.listAudit(distributorId),
  });
}
