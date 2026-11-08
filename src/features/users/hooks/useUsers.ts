'use client';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { USERS_QUERY_KEY } from '../constants/users.constants';
export function useUsers() { return useQuery({ queryKey: USERS_QUERY_KEY, queryFn: usersService.list }); }
