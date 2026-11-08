'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { userSchema, type UserInput } from '../schemas/user.schema';
import { useUpdateUser } from '../hooks/useUpdateUser';
import type { User } from '../types/users.types';

export function UserForm({ user, onSuccess }: { user: User; onSuccess?: (user: User) => void }) {
  const mutation = useUpdateUser();
  const { register, handleSubmit, formState: { errors } } = useForm<UserInput>({ resolver: zodResolver(userSchema), defaultValues: { nombreCompleto: user.nombreCompleto, correo: user.correo, whatsapp: user.whatsapp ?? '', password: '' } });
  const submit = handleSubmit(async (values) => { try { const result = await mutation.mutateAsync({ id: user.id, input: values }); onSuccess?.(result); } catch { /* mutation exposes the error */ } });
  const input = 'mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40';
  return <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-5"><div><h2 className="text-xl font-bold">Editar usuario</h2><p className="mt-1 text-sm text-muted-foreground">Actualiza los datos de contacto.</p></div><label className="block text-sm font-medium">Nombre completo<input {...register('nombreCompleto')} className={input} />{errors.nombreCompleto && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.nombreCompleto.message}</span>}</label><label className="block text-sm font-medium">Correo<input type="email" {...register('correo')} className={input} />{errors.correo && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.correo.message}</span>}</label><label className="block text-sm font-medium">WhatsApp<input type="tel" {...register('whatsapp')} className={input} />{errors.whatsapp && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.whatsapp.message}</span>}</label><label className="block text-sm font-medium">Nueva contraseña <span className="font-normal text-muted-foreground">(opcional)</span><input type="password" autoComplete="new-password" {...register('password')} className={input} />{errors.password && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.password.message}</span>}</label>{mutation.error && <p role="alert" className="text-sm text-red-500">{mutation.error.message}</p>}<button type="submit" disabled={mutation.isPending} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{mutation.isPending && <LoaderCircle size={16} className="animate-spin" />}{mutation.isPending ? 'Guardando...' : 'Guardar cambios'}</button></form>;
}
