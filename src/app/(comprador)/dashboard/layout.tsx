import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClientDashboardGuard } from './componentes/ClientDashboardGuard';
import './buyer.css';

export default function CompradorLayout({ children }: { children: ReactNode }) {
  return <ClientDashboardGuard><DashboardLayout role="COMPRADOR" title="Mi cuenta"><div className="sf-buyer">{children}</div></DashboardLayout></ClientDashboardGuard>;
}
