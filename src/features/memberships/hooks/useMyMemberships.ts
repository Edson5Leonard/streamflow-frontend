'use client';
import { useQuery } from '@tanstack/react-query';
import { membershipsService } from '../services/memberships.service';
import { MEMBERSHIPS_QUERY_KEY } from '../constants/memberships.constants';
export function useMyMemberships() { return useQuery({ queryKey: [...MEMBERSHIPS_QUERY_KEY, 'mine'], queryFn: membershipsService.listMine }); }
