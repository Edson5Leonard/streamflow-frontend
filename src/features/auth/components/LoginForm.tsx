'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useLogin';
import { ROLE_DASHBOARD } from '../constants/auth.routes';
import { env } from '@/config/env';
import { AuthField, AuthSubmit } from './AuthFormControls';

export function LoginForm() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), defaultValues: { correo: '', password: '' },
  });
  const submit = handleSubmit(values => login.mutate(values, {
    onSuccess: session => window.location.assign(ROLE_DASHBOARD[session.role]),
  }));
  return (
    <form className="sf-auth-form" onSubmit={submit} noValidate>
      <AuthField id="login-email" label="Correo electrónico" type="email" autoComplete="email"
        placeholder="nombre@correo.com" error={errors.correo?.message} {...register('correo')} />
      <AuthField id="login-password" label="Contraseña" type="password" autoComplete="current-password"
        placeholder="Ingresa tu contraseña" error={errors.password?.message} {...register('password')} />
      {login.error && <p className="sf-auth-alert" role="alert">{login.error.message}</p>}
      <AuthSubmit label="Iniciar sesión" pendingLabel="Ingresando…" pending={login.isPending} />
      {env.useMocks && (
        <details className="sf-auth-demo">
          <summary>Cuentas de prueba</summary>
          <p>Comprador · comprador@demo.com</p>
          <p>Distribuidor · distribuidor@demo.com</p>
          <p>Superadmin · admin@demo.com</p>
          <p>Contraseña · <strong>Demo1234</strong></p>
        </details>
      )}
    </form>
  );
}
