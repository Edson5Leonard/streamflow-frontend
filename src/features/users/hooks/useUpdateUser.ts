'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USERS_QUERY_KEY } from '../constants/users.constants';
import { usersService } from '../services/users.service';
import type { UserUpdate } from '../types/users.types';
export function useUpdateUser() { const client = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id: string; input: UserUpdate }) => usersService.update(id, input), onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: USERS_QUERY_KEY }), client.invalidateQueries({ queryKey: ['auth', 'profile'] })]); } }); }
