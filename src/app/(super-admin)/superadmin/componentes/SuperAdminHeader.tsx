import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { NetworkCover } from './NetworkCover';

export function SuperAdminHeader({ name, active }: { name: string; active: number }) {
  return (
    <NetworkCover title={`Hola, ${name}`} description="Consulta las ventas de la red y las solicitudes que requieren tu revisión."
      metric={active} label="distribuidores activos">
      <Link href="/superadmin/distribuidores" className="sf-network-action">
        Ver distribuidores <ArrowUpRight size={16} />
      </Link>
    </NetworkCover>
  );
}
