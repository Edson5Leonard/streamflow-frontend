'use client';
import { useAuth } from '@/contexts/AuthProvider';
export function useSession() { return useAuth(); }
