'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USERS_QUERY_KEY } from '../constants/users.constants';
import { usersService } from '../services/users.service';
export function useDeleteUser() { const client = useQueryClient(); return useMutation({ mutationFn: usersService.deactivate, onSuccess: () => client.invalidateQueries({ queryKey: USERS_QUERY_KEY }) }); }
