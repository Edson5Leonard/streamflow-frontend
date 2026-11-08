'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MEMBERSHIPS_QUERY_KEY } from '../constants/memberships.constants';
import { membershipsService } from '../services/memberships.service';
export function useRejectMembership() { const client = useQueryClient(); return useMutation({ mutationFn: ({ id, motivo }: { id: string; motivo: string }) => membershipsService.reject(id, motivo), onSuccess: () => client.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY }) }); }
