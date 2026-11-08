'use client';
import { useQuery } from '@tanstack/react-query';
import { PAYMENTS_QUERY_KEY } from '../constants/payments.constants';
import { paymentsService } from '../services/payments.service';
export function usePayment(id: string, token?: string) { return useQuery({ queryKey: [...PAYMENTS_QUERY_KEY, id, token ?? 'private'], queryFn: async () => token ? paymentsService.track(id, token) : paymentsService.get(id), enabled: Boolean(id) }); }
