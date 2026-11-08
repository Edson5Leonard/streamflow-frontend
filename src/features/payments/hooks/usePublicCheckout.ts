'use client';
import { useMutation } from '@tanstack/react-query';
import { paymentsService } from '../services/payments.service';

export function usePublicCheckout() {
  return useMutation({ mutationFn: paymentsService.createCart });
}
