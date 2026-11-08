import Link from 'next/link';
import { AuthLayout } from '../componentes/AuthLayout';
import { LoginForm } from '../componentes/LoginForm';
import { authUrl } from '@/features/auth/constants/auth.routes';

export const instant = false;

export default async function Page({ searchParams }: {
  searchParams: Promise<{ distribuidorId?: string | string[] }>;
}) {
  const query = await searchParams;
  const distribuidorId = typeof query.distribuidorId === 'string' ? query.distribuidorId : undefined;
  return (
    <AuthLayout view="login" distributorId={distribuidorId}
      title="Iniciar sesión" description="Accede a tu cuenta de StreamFlow."
      footer={<><Link href={authUrl('/recuperar-password', distribuidorId)}>¿Olvidaste tu contraseña?</Link>
          <p>¿Aún no tienes cuenta? <Link href={authUrl('/registro', distribuidorId)}>Regístrate</Link></p></>}>
      <LoginForm />
    </AuthLayout>
  );
}
