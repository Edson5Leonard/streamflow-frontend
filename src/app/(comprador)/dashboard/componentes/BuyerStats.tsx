import Link from 'next/link';
import { CheckCircle2, Clock3, ReceiptText } from 'lucide-react';
import { SlideIn } from '@/components/animation/SlideIn';

export function BuyerStats({ purchases, pending, orders }: { purchases: number; pending: number; orders: number }) {
  const stats = [
    { label: 'Compras entregadas', value: purchases, href: '/dashboard/historial#entregas', Icon: CheckCircle2 },
    { label: 'Pedidos pendientes', value: pending, href: '/dashboard/historial#pedidos', Icon: Clock3 },
    { label: 'Pedidos registrados', value: orders, href: '/dashboard/historial#pedidos', Icon: ReceiptText },
  ];
  return <div className="sf-buyer-stats">{stats.map(({ label, value, href, Icon }, index) => (
    <SlideIn key={label} delay={index * .05}>
      <Link href={href}><Icon size={19} /><strong>{value}</strong><span>{label}</span></Link>
    </SlideIn>
  ))}</div>;
}
