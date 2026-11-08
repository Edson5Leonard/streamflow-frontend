import Link from 'next/link';
import { ArrowRight, Disc3 } from 'lucide-react';
import { SlideIn } from '@/components/animation/SlideIn';
import { formatDate } from '@/utils/format-date';
import { formatCurrency } from '@/utils/format-currency';
import type { Purchase } from '@/features/sales/types/sales.types';

export function RecentPurchases({ purchases }: { purchases: Purchase[] }) {
  const recent = [...purchases].sort((a,b) => Date.parse(b.fechaVenta) - Date.parse(a.fechaVenta)).slice(0, 3);
  return (
    <SlideIn revealOnScroll className="sf-buyer-panel">
      <div className="sf-buyer-section-title"><h2>Últimas entregas</h2><Link href="/dashboard/historial#entregas">Ver historial <ArrowRight size={15} /></Link></div>
      {recent.length ? <ul>{recent.map(item => (
        <li key={item.id} className="sf-buyer-row">
          <Disc3 size={20} /><div><strong>{item.servicio}</strong><small>{formatDate(item.fechaVenta)}</small></div>
          <b>{formatCurrency(item.precioPagado)}</b>
        </li>
      ))}</ul> : <p>Tus servicios aparecerán aquí cuando se entreguen.</p>}
    </SlideIn>
  );
}
