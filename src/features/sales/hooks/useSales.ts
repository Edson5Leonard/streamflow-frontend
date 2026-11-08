'use client';
import { useQuery } from '@tanstack/react-query';
import { salesService } from '../services/sales.service';
import { SALES_QUERY_KEY } from '../constants/sales.constants';
export function useSales() { return useQuery({ queryKey: SALES_QUERY_KEY, queryFn: salesService.list }); }
