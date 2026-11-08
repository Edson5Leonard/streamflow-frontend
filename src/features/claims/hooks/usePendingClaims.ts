'use client';
import { useQuery } from '@tanstack/react-query';
import { claimsService } from '../services/claims.service';
import { CLAIMS_QUERY_KEY } from '../constants/claims.constants';
export function usePendingClaims() { return useQuery({ queryKey: [...CLAIMS_QUERY_KEY, 'pending'], queryFn: claimsService.listPending }); }
