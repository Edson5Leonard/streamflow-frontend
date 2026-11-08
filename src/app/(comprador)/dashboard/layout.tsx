import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import './buyer.css';

export default function CompradorLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout role="COMPRADOR" title="Mi cuenta"><div className="sf-buyer">{children}</div></DashboardLayout>;
}
