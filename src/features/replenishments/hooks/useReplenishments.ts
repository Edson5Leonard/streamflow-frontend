'use client';
import { useQuery } from '@tanstack/react-query';
import { REPLENISHMENTS_QUERY_KEY } from '../constants/replenishments.constants';
import { replenishmentsService } from '../services/replenishments.service';
export function useReplenishments() { return useQuery({ queryKey: [...REPLENISHMENTS_QUERY_KEY, 'all'], queryFn: replenishmentsService.list }); }
