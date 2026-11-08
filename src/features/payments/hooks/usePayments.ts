'use client';
import { useQuery } from '@tanstack/react-query';
import { PAYMENTS_QUERY_KEY } from '../constants/payments.constants';
import { paymentsService } from '../services/payments.service';
export function usePayments(distributorId: string) { return useQuery({ queryKey: [...PAYMENTS_QUERY_KEY, 'distributor', distributorId], queryFn: () => paymentsService.list(distributorId), enabled: Boolean(distributorId) }); }
