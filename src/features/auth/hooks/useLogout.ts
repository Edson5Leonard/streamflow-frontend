'use client';
import { useAuth } from '@/contexts/AuthProvider';
export function useLogout() { return useAuth().logout; }
