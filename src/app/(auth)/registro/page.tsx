import Link from 'next/link';
import { AuthLayout } from '../componentes/AuthLayout';
import { RegisterForm } from '../componentes/RegisterForm';
import { authUrl } from '@/features/auth/constants/auth.routes';

export const instant = false;

export default async function Page({ searchParams }: {
  searchParams: Promise<{ distribuidorId?: string | string[] }>;
}) {
  const query = await searchParams;
  const distribuidorId = typeof query.distribuidorId === 'string' ? query.distribuidorId : undefined;
  return (
    <AuthLayout view="register" distributorId={distribuidorId}
      title="Crear una cuenta" description="Vincula tu cuenta a la tienda de tu distribuidor."
      footer={<><p>¿Ya tienes una cuenta? <Link href={authUrl('/login', distribuidorId)}>Inicia sesión</Link></p></>}>
      <RegisterForm distribuidorId={distribuidorId ?? ''} />
    </AuthLayout>
  );
}
