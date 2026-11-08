'use client';
import { useQuery } from '@tanstack/react-query';
import { accountsService } from '../services/accounts.service';
import { ACCOUNTS_QUERY_KEY } from '../constants/accounts.constants';
export function useAccounts() { return useQuery({ queryKey: ACCOUNTS_QUERY_KEY, queryFn: accountsService.list }); }
