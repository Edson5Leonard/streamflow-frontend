'use client';
import { useQuery } from '@tanstack/react-query';
import { replenishmentsService } from '../services/replenishments.service';
import { REPLENISHMENTS_QUERY_KEY } from '../constants/replenishments.constants';
export function useMyReplenishments() { return useQuery({ queryKey: [...REPLENISHMENTS_QUERY_KEY, 'mine'], queryFn: replenishmentsService.listMine }); }
