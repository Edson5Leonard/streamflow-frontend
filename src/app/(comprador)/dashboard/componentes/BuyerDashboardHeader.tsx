import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BuyerCover } from './BuyerCover';

export function BuyerDashboardHeader({ name }: { name: string }) {
  return (
    <BuyerCover view="home" title={`Hola, ${name}`} description="Consulta lo que ya compraste o elige el próximo servicio de tu tienda.">
      <Link className="sf-buyer-primary" href="/dashboard/catalogo">Explorar catálogo <ArrowUpRight size={16} /></Link>
    </BuyerCover>
  );
}
