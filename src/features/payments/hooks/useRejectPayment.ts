'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PAYMENTS_QUERY_KEY } from '../constants/payments.constants';
import { paymentsService } from '../services/payments.service';
export function useRejectPayment() { const client = useQueryClient(); return useMutation({ mutationFn: ({ id, motivo }: { id: string; motivo: string }) => paymentsService.reject(id, motivo), onSuccess: () => client.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY }) }); }
