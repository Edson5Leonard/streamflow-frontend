import { redirect } from 'next/navigation';

export default async function TiendaPublicaPage({
  params,
}: {
  params: Promise<{ distribuidorId: string }>;
}) {
  const { distribuidorId } = await params;
  redirect(`/tiendas/${encodeURIComponent(distribuidorId)}`);
}
