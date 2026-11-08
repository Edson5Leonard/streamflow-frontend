import Link from 'next/link';
import { AuthLayout } from '../componentes/AuthLayout';
import { ForgotPasswordForm } from '../componentes/ForgotPasswordForm';
import { authUrl } from '@/features/auth/constants/auth.routes';

export const instant = false;

export default async function Page({ searchParams }: {
  searchParams: Promise<{ distribuidorId?: string | string[] }>;
}) {
  const query = await searchParams;
  const distribuidorId = typeof query.distribuidorId === 'string' ? query.distribuidorId : undefined;
  return (
    <AuthLayout view="recovery" distributorId={distribuidorId}
      title="Recuperar acceso" description="¿Olvidaste tu contraseña? Puedes pedir ayuda a tu tienda."
      footer={<><Link href={authUrl('/login', distribuidorId)}>Volver a iniciar sesión</Link></>}>
      <ForgotPasswordForm distributorId={distribuidorId} />
    </AuthLayout>
  );
}
