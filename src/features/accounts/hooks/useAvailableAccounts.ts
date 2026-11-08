'use client';
import { useQuery } from '@tanstack/react-query';
import { ACCOUNTS_QUERY_KEY } from '../constants/accounts.constants';
import { accountsService } from '../services/accounts.service';
export function useAvailableAccounts() { return useQuery({ queryKey: [...ACCOUNTS_QUERY_KEY, 'available'], queryFn: accountsService.listAvailable }); }
