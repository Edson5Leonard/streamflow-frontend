'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { serviceInputSchema, type ServiceInput } from '../schemas/service.schema';
import { useCreateService } from '../hooks/useCreateService';
import type { Service } from '../types/services.types';

const field = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-white';
export function ServiceForm({ onSuccess }: { onSuccess?: (service: Service) => void }) {
  const mutation = useCreateService();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceInput>({ resolver: zodResolver(serviceInputSchema), defaultValues: { nombre: '', categoria: '', descripcion: '', precioMayorista: 0, precioReposicion: null, plataforma: '', tipoPlan: 'COMPLETA', cantidadDispositivos: null, cantidadPerfiles: null, duracionMeses: 1, precioMinimoVenta: null, activo: true } });
  const submit = handleSubmit(async (values) => { try { const created = await mutation.mutateAsync(values); reset(); onSuccess?.(created); } catch { /* mutation exposes the error */ } });
  const optionalNumber = (name: 'cantidadDispositivos' | 'cantidadPerfiles' | 'precioMinimoVenta') => register(name, { setValueAs: (value: string) => value === '' ? null : Number(value) });
  return <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
    <div><h2 className="text-lg font-bold">Crear servicio</h2><p className="mt-1 text-sm text-slate-500">Agrega un plan al catálogo global.</p></div>
    <label className="block text-sm font-medium">Nombre<input {...register('nombre')} className={`${field} mt-1.5`} />{errors.nombre && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.nombre.message}</span>}</label>
    <label className="block text-sm font-medium">Plataforma<input {...register('plataforma')} className={`${field} mt-1.5`} />{errors.plataforma && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.plataforma.message}</span>}</label>
    <label className="block text-sm font-medium">Categoría<input {...register('categoria')} className={`${field} mt-1.5`} />{errors.categoria && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.categoria.message}</span>}</label>
    <label className="block text-sm font-medium">Descripción<textarea {...register('descripcion')} className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 bg-transparent p-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10" />{errors.descripcion && <span role="alert" className="mt-1 block text-xs text-red-500">{errors.descripcion.message}</span>}</label>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm font-medium">Tipo de plan<select {...register('tipoPlan')} className={`${field} mt-1.5`}><option value="COMPLETA">Cuenta completa</option><option value="PERFIL">Perfil</option></select></label>
      <label className="block text-sm font-medium">Duración (meses)<input type="number" min="1" step="1" {...register('duracionMeses', { valueAsNumber: true })} className={`${field} mt-1.5`} />{errors.duracionMeses && <span role="alert" className="mt-1 block text-xs text-red-500">Ingresa una duración válida.</span>}</label>
      <label className="block text-sm font-medium">Dispositivos<input type="number" min="1" step="1" {...optionalNumber('cantidadDispositivos')} className={`${field} mt-1.5`} />{errors.cantidadDispositivos && <span role="alert" className="mt-1 block text-xs text-red-500">Ingresa una cantidad válida.</span>}</label>
      <label className="block text-sm font-medium">Perfiles<input type="number" min="1" step="1" {...optionalNumber('cantidadPerfiles')} className={`${field} mt-1.5`} />{errors.cantidadPerfiles && <span role="alert" className="mt-1 block text-xs text-red-500">Ingresa una cantidad válida.</span>}</label>
    </div>
    <label className="block text-sm font-medium">Precio mayorista (S/)<input type="number" step="0.01" min="0" {...register('precioMayorista', { valueAsNumber: true })} className={`${field} mt-1.5`} />{errors.precioMayorista && <span role="alert" className="mt-1 block text-xs text-red-500">Ingresa un precio válido.</span>}</label>
    <label className="block text-sm font-medium">Precio mínimo de venta (S/)<input type="number" step="0.01" min="0" {...optionalNumber('precioMinimoVenta')} className={`${field} mt-1.5`} />{errors.precioMinimoVenta && <span role="alert" className="mt-1 block text-xs text-red-500">Ingresa un precio válido.</span>}</label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('activo')} /> Servicio activo</label>
    {mutation.error && <p role="alert" className="text-sm text-red-500">{mutation.error.message}</p>}
    <button disabled={mutation.isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50">{mutation.isPending && <LoaderCircle size={16} className="animate-spin" />}{mutation.isPending ? 'Guardando...' : 'Crear servicio'}</button>
  </form>;
}
