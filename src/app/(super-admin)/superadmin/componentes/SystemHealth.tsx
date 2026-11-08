import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SlideIn } from '@/components/animation/SlideIn';

export function SystemHealth({ memberships, replenishments, claims }: { memberships: number; replenishments: number; claims: number }) {
  const queues = [
    { label: 'Pagos de membresía', count: memberships, href: '/superadmin/pagos-suscripcion' },
    { label: 'Reposiciones por atender', count: replenishments, href: '/superadmin/stock-global#reposiciones' },
    { label: 'Cuentas en auditoría', count: claims, href: '/superadmin/auditoria' },
  ];
  return (
    <section className="sf-network-panel">
      <h2>Pendientes de revisión</h2>
      {queues.map(({ label, count, href }, index) => (
        <SlideIn key={href} delay={index * 0.05}>
          <Link href={href} className="sf-network-queue">
            <span>{label}</span><strong>{count}</strong><ArrowUpRight size={16} />
          </Link>
        </SlideIn>
      ))}
    </section>
  );
}
