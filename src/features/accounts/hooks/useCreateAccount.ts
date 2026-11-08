'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ACCOUNTS_QUERY_KEY } from '../constants/accounts.constants';
import { accountsService } from '../services/accounts.service';
import type { AccountInput, AccountScope } from '../types/accounts.types';
export function useCreateAccount() { const client = useQueryClient(); return useMutation({ mutationFn: ({ scope, input }: { scope: AccountScope; input: AccountInput }) => accountsService.create(scope, input), onSuccess: () => client.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY }) }); }
