'use client';
import { useQuery } from '@tanstack/react-query';
import { storesService } from '../services/stores.service';
import { STORES_QUERY_KEY, STORE_STALE_TIME } from '../constants/stores.constants';
export function useStores() { return useQuery({ queryKey: [...STORES_QUERY_KEY, 'available'], queryFn: storesService.listAvailable, staleTime: STORE_STALE_TIME }); }
