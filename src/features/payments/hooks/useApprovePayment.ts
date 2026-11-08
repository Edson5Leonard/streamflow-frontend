'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PAYMENTS_QUERY_KEY } from '../constants/payments.constants';
import { paymentsService } from '../services/payments.service';
export function useApprovePayment() { const client = useQueryClient(); return useMutation({ mutationFn: paymentsService.approve, onSuccess: () => client.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY }) }); }
