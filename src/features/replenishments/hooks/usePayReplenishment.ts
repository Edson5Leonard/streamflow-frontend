'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REPLENISHMENTS_QUERY_KEY } from '../constants/replenishments.constants';
import { replenishmentsService } from '../services/replenishments.service';
export function usePayReplenishment() { const client = useQueryClient(); return useMutation({ mutationFn: replenishmentsService.pay, onSuccess: () => client.invalidateQueries({ queryKey: REPLENISHMENTS_QUERY_KEY }) }); }
