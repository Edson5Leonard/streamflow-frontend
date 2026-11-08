'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MEMBERSHIPS_QUERY_KEY } from '../constants/memberships.constants';
import { membershipsService } from '../services/memberships.service';
export function useCreateMembershipPayment() { const client = useQueryClient(); return useMutation({ mutationFn: membershipsService.create, onSuccess: () => client.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY }) }); }
