'use client';
import { useQuery } from '@tanstack/react-query';
import { storesService } from '../services/stores.service';
import { STORE_CATALOG_QUERY_KEY, STORE_STALE_TIME } from '../constants/stores.constants';
export function useStoreCatalog(distributorId: string) { return useQuery({ queryKey: [...STORE_CATALOG_QUERY_KEY, distributorId], queryFn: () => storesService.getCatalog(distributorId), enabled: Boolean(distributorId), staleTime: STORE_STALE_TIME }); }
