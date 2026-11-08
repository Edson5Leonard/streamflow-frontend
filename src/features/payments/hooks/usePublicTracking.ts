'use client';
import { useQuery } from '@tanstack/react-query';
import { paymentsService } from '../services/payments.service';
import { PAYMENTS_QUERY_KEY } from '../constants/payments.constants';

export function usePublicTracking(id: string, token: string) {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, 'public', id, token],
    queryFn: () => paymentsService.track(id, token),
    retry: false,
    refetchInterval: query => query.state.data?.estado === 'PENDIENTE' ? 5000 : false,
  });
}
