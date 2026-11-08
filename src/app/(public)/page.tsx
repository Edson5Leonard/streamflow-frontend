import { redirect } from 'next/navigation';
import { StoreDirectory } from './components/StoreDirectory';
import { LandingHero } from './components/LandingHero';
import { HowItWorksSection, LandingCallout } from './components/LandingSections';
import { readOrderLinks, trackingHref } from './components/tracking-links';
import { getStoreHref } from '@/features/stores/utils/stores.utils';

// Legacy links redirect based on the URL before rendering the home page.
export const instant = false;

export default async function PublicHome({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const orders = readOrderLinks(typeof query.pedidos === 'string' ? query.pedidos : undefined);
  if (orders.length) redirect(trackingHref(orders[0], orders));
  if (typeof query.pago === 'string' && typeof query.token === 'string') redirect(trackingHref({ id: query.pago, tokenPublico: query.token }));
  if (typeof query.distribuidorId === 'string') redirect(getStoreHref(query.distribuidorId));

  return <>
    <LandingHero />
    <StoreDirectory/>
    <HowItWorksSection />
    <LandingCallout />
  </>;
}
