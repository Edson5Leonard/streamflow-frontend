'use client';
import { useQuery } from '@tanstack/react-query';
import { SALES_QUERY_KEY } from '../constants/sales.constants';
import { salesService } from '../services/sales.service';
export function useSaleDetail(paymentId: string) { return useQuery({ queryKey: [...SALES_QUERY_KEY, 'payment', paymentId], queryFn: () => salesService.getByPayment(paymentId), enabled: Boolean(paymentId) }); }
