'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CLAIMS_QUERY_KEY } from '../constants/claims.constants';
import { claimsService } from '../services/claims.service';
import type { ClaimInput, PublicClaimInput } from '../types/claims.types';
export function useCreateClaim() { const client = useQueryClient(); return useMutation({ mutationFn: (input: ClaimInput | PublicClaimInput) => 'pagoId' in input ? claimsService.createPublic(input) : claimsService.create(input), onSuccess: () => client.invalidateQueries({ queryKey: CLAIMS_QUERY_KEY }) }); }
