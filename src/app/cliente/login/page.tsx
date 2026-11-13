import { ClientLoginForm } from './ClientLoginForm';

export default async function ClientLoginPage({ searchParams }: {
  searchParams: Promise<{ tienda?: string | string[]; distribuidorId?: string | string[] }>;
}) {
  const query = await searchParams;
  const initialDistributorId = typeof query.tienda === 'string'
    ? query.tienda
    : typeof query.distribuidorId === 'string' ? query.distribuidorId : '';
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <ClientLoginForm initialDistributorId={initialDistributorId} />
    </main>
  );
}
