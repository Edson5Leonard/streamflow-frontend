'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../hooks/useSession';
export function SessionGuard({ children }: { children: ReactNode }) { const { isAuthenticated } = useSession(); const router = useRouter(); useEffect(() => { if (!isAuthenticated) router.replace('/login'); }, [isAuthenticated, router]); return isAuthenticated ? children : null; }
