'use client';
import { useQuery } from '@tanstack/react-query';
import { USERS_QUERY_KEY } from '../constants/users.constants';
import { usersService } from '../services/users.service';
export function useUser(id: string) { return useQuery({ queryKey: [...USERS_QUERY_KEY, id], queryFn: () => usersService.get(id), enabled: Boolean(id) }); }
