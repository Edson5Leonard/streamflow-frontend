import { Suspense } from 'react';
import { LoadingState } from '@/components/feedback/LoadingState';
import { PublicCart } from '../components/PublicCart';

type Props = { params: Promise<{ distribuidorId: string }> };

export default function StoreCartPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingState label="Cargando carrito" />}>
      <StoreCartContent params={params} />
    </Suspense>
  );
}

async function StoreCartContent({ params }: Props) {
  const { distribuidorId } = await params;
  return <PublicCart key={distribuidorId} distributorId={distribuidorId} />;
}
