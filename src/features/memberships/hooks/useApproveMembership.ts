'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MEMBERSHIPS_QUERY_KEY } from '../constants/memberships.constants';
import { membershipsService } from '../services/memberships.service';
export function useApproveMembership() { const client = useQueryClient(); return useMutation({ mutationFn: membershipsService.approve, onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY }), client.invalidateQueries({ queryKey: ['users'] }), client.invalidateQueries({ queryKey: ['statistics'] })]); } }); }
