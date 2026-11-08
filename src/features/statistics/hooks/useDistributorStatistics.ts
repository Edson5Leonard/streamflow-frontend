'use client';
import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '../services/statistics.service';
import { STATISTICS_QUERY_KEY } from '../constants/statistics.constants';
export function useDistributorStatistics() { return useQuery({ queryKey: [...STATISTICS_QUERY_KEY, 'distributor'], queryFn: statisticsService.distributor }); }
