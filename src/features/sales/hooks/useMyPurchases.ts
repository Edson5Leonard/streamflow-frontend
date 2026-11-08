'use client';
import { useQuery } from '@tanstack/react-query';
import { SALES_QUERY_KEY } from '../constants/sales.constants';
import { salesService } from '../services/sales.service';
export function useMyPurchases() { return useQuery({ queryKey: [...SALES_QUERY_KEY, 'my-purchases'], queryFn: salesService.listMyPurchases }); }
