'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerSchema } from '../schemas/auth.schema';
import { useRegister } from '../hooks/useRegister';
import { AUTH_ROUTES, authUrl } from '../constants/auth.routes';
import { AuthField, AuthSubmit } from './AuthFormControls';

const schema = registerSchema.pick({ nombreCompleto: true, correo: true, password: true });
type Values = z.infer<typeof schema>;

export function RegisterForm({ distribuidorId }: { distribuidorId: string }) {
  const registration = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema), defaultValues: { nombreCompleto: '', correo: '', password: '' },
  });
  const submit = handleSubmit(values => {
    if (distribuidorId) registration.mutate({ ...values, distribuidorId }, {
      onSuccess: () => window.location.assign(authUrl(AUTH_ROUTES.login, distribuidorId)),
    });
  });
  if (!distribuidorId) return (
    <div className="sf-auth-notice">
      <p>Tu cuenta se crea desde una tienda. Elige la tuya y pulsa «Registrarme».</p>
      <Link className="sf-auth-action" href="/#tiendas">Elegir tienda →</Link>
    </div>
  );
  return (
    <form className="sf-auth-form" onSubmit={submit} noValidate>
      <AuthField id="register-name" label="Nombre completo" autoComplete="name" placeholder="Nombre y apellido"
        error={errors.nombreCompleto && 'Ingresa al menos 2 caracteres.'} {...register('nombreCompleto')} />
      <AuthField id="register-email" label="Correo electrónico" type="email" autoComplete="email"
        placeholder="nombre@correo.com" error={errors.correo && 'Ingresa un correo válido.'} {...register('correo')} />
      <AuthField id="register-password" label="Contraseña" type="password" autoComplete="new-password"
        placeholder="Mínimo 8 caracteres" error={errors.password && 'Usa al menos 8 caracteres.'} {...register('password')} />
      {registration.error && <p role="alert" className="sf-auth-alert">{registration.error.message}</p>}
      <AuthSubmit label="Crear mi cuenta" pendingLabel="Creando cuenta…" pending={registration.isPending} />
    </form>
  );
}
