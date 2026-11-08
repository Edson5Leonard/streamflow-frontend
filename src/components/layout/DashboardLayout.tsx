import type { ReactNode } from 'react';
import { AppShell } from './AppShell';
import type { UserRole } from '@/constants/roles.constants';
import { PageContainer } from './PageContainer';

export function DashboardLayout({ children, title, role }: { children: ReactNode; title?: string; role: UserRole }) {
  return <AppShell title={title} role={role}><PageContainer>{children}</PageContainer></AppShell>;
}
