'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REPLENISHMENTS_QUERY_KEY } from '../constants/replenishments.constants';
import { replenishmentsService } from '../services/replenishments.service';
export function useCreateReplenishment() { const client = useQueryClient(); return useMutation({ mutationFn: replenishmentsService.create, onSuccess: () => client.invalidateQueries({ queryKey: REPLENISHMENTS_QUERY_KEY }) }); }
