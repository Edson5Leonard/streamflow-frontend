'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CLAIMS_QUERY_KEY } from '../constants/claims.constants';
import { claimsService } from '../services/claims.service';
export function useReplaceAccount() { const client = useQueryClient(); return useMutation({ mutationFn: claimsService.replace, onSuccess: () => client.invalidateQueries({ queryKey: CLAIMS_QUERY_KEY }) }); }
