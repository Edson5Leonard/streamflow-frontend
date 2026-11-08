'use client';
import { useQuery } from '@tanstack/react-query';
import { paymentsService } from '../services/payments.service';
import { PAYMENTS_QUERY_KEY } from '../constants/payments.constants';
export function useMyOrders() { return useQuery({ queryKey: [...PAYMENTS_QUERY_KEY, 'my-orders'], queryFn: paymentsService.listMyOrders }); }
