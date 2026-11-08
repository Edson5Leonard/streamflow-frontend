'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PAYMENTS_QUERY_KEY } from '../constants/payments.constants';
import { paymentsService } from '../services/payments.service';
import type { PaymentRequest, PublicPaymentRequest } from '../types/payments.types';
export function useCreatePayment() { const client = useQueryClient(); return useMutation({ mutationFn: async (input: PaymentRequest | PublicPaymentRequest) => 'distribuidorId' in input ? paymentsService.createPublic(input) : paymentsService.create(input), onSuccess: () => client.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY }) }); }
