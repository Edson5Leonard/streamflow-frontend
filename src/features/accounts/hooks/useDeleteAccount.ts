'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ACCOUNTS_QUERY_KEY } from '../constants/accounts.constants';
import { accountsService } from '../services/accounts.service';
import type { AccountScope } from '../types/accounts.types';
export function useDeleteAccount() { const client = useQueryClient(); return useMutation({ mutationFn: ({ scope, id }: { scope: AccountScope; id: string }) => accountsService.remove(scope, id), onSuccess: () => client.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY }) }); }
