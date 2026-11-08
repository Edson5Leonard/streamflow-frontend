'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REPLENISHMENTS_QUERY_KEY } from '../constants/replenishments.constants';
import { ACCOUNTS_QUERY_KEY } from '@/features/accounts/constants/accounts.constants';
import { replenishmentsService } from '../services/replenishments.service';
export function useApproveReplenishment() { const client = useQueryClient(); return useMutation({ mutationFn: replenishmentsService.approve, onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: REPLENISHMENTS_QUERY_KEY }), client.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY })]); } }); }
