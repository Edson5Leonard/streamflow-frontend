'use client';
import type { ReactNode } from 'react';
import type { UserRole } from '../types/auth.types';
import { useSession } from '../hooks/useSession';
import { UnauthorizedState } from '@/components/feedback/UnauthorizedState';
export function RoleGuard({ roles, children }: { roles: UserRole[]; children: ReactNode }) { const { role, isAuthenticated } = useSession(); return isAuthenticated && role && roles.includes(role) ? children : <UnauthorizedState />; }
