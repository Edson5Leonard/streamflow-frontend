import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DistributorCover } from './DistributorCover';

export function DistributorDashboardHeader({ name, pending }: { name: string; pending: number }) {
  return (
    <DistributorCover title={`Hola, ${name}`} description="Consulta las ventas de tu tienda y revisa los pedidos que esperan una respuesta."
      value={pending} label="pagos por revisar">
      <Link className="sf-dist-action" href="/admin/pedidos">Revisar pedidos <ArrowUpRight size={16} /></Link>
    </DistributorCover>
  );
}
