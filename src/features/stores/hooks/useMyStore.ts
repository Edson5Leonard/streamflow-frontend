'use client';
import { useQuery } from '@tanstack/react-query';
import { STORES_QUERY_KEY } from '../constants/stores.constants';
import { storesService } from '../services/stores.service';

export const MY_STORE_QUERY_KEY = [...STORES_QUERY_KEY, 'mine'] as const;

export function useMyStore() {
  return useQuery({ queryKey: MY_STORE_QUERY_KEY, queryFn: storesService.getMyStore });
}
