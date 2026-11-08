'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ACCOUNTS_QUERY_KEY } from '../constants/accounts.constants';
import { accountsService } from '../services/accounts.service';
import type { AccountScope, AccountUpdate } from '../types/accounts.types';
export function useUpdateAccount() { const client = useQueryClient(); return useMutation({ mutationFn: ({ scope, id, input }: { scope: AccountScope; id: string; input: AccountUpdate }) => accountsService.update(scope, id, input), onSuccess: () => client.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY }) }); }
