import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import './superadmin.css';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="SUPER_ADMIN" title="Panel de administración">
      <div className="sf-network">{children}</div>
    </DashboardLayout>
  );
}
