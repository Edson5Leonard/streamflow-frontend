import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import './distributor.css';

export default function DistribuidorLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout role="DISTRIBUIDOR" title="Panel de distribuidor">
    <div className="sf-distributor">{children}</div>
  </DashboardLayout>;
}
