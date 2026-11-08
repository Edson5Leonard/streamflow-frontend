'use client';
import { useQuery } from '@tanstack/react-query';
import { STATISTICS_QUERY_KEY } from '../constants/statistics.constants';
import { statisticsService } from '../services/statistics.service';
export function useGlobalStatistics() { return useQuery({ queryKey: [...STATISTICS_QUERY_KEY, 'global'], queryFn: statisticsService.global }); }
