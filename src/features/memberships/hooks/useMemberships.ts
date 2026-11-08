'use client';
import { useQuery } from '@tanstack/react-query';
import { MEMBERSHIPS_QUERY_KEY } from '../constants/memberships.constants';
import { membershipsService } from '../services/memberships.service';
export function useMemberships() { return useQuery({ queryKey: [...MEMBERSHIPS_QUERY_KEY, 'pending'], queryFn: membershipsService.listPending }); }
