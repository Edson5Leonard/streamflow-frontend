'use client';
import { useQuery } from '@tanstack/react-query';
import { CLAIMS_QUERY_KEY } from '../constants/claims.constants';
import { claimsService } from '../services/claims.service';
export function useObservedClaims() { return useQuery({ queryKey: [...CLAIMS_QUERY_KEY, 'observed'], queryFn: claimsService.listObserved }); }
