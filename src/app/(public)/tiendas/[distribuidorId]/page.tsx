import { PublicStoreCatalog } from './components/PublicStoreCatalog';

export default async function StorePage({ params }: { params: Promise<{ distribuidorId: string }> }) {
  const { distribuidorId } = await params;
  return <PublicStoreCatalog key={distribuidorId} distributorId={distribuidorId}/>;
}
