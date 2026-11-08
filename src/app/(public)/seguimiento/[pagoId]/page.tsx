import Link from 'next/link';
import { TrackingPanel } from './TrackingPanel';
import { readOrderLinks } from '../../components/tracking-links';

type Props = {
  params: Promise<{ pagoId: string }>;
  searchParams: Promise<{ token?: string; pedidos?: string }>;
};
export default async function TrackingPage({ params, searchParams }: Props) {
  const [{ pagoId }, { token, pedidos }] = await Promise.all([params, searchParams]);
  if (!token || typeof token !== 'string') return <section className="py-12">
    <h1 className="text-2xl font-bold">Enlace de seguimiento incompleto</h1>
    <p className="my-3">Abre el enlace completo que recibiste al enviar tu comprobante.</p>
    <Link className="underline" href="/">Volver a las tiendas</Link>
  </section>;
  return <TrackingPanel key={pagoId} id={pagoId} token={token} orders={readOrderLinks(pedidos)}/>;
}
