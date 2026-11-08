'use client';
import { useState, type FormEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useActiveServices } from '@/features/services/hooks/useActiveServices';
import { useCreateAccount } from '../hooks/useCreateAccount';
import type { Account, AccountScope, StockType } from '../types/accounts.types';

export function AccountForm({ scope, onSuccess }: { scope: AccountScope; onSuccess?: (account: Account) => void }) {
  const [serviceId, setServiceId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePin, setProfilePin] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<StockType>('VENTA');
  const [error, setError] = useState('');
  const services = useActiveServices();
  const create = useCreateAccount();
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    try {
      const account = await create.mutateAsync({ scope, input: { servicioId: serviceId, correo: email, password, perfilPin: profilePin || null, ...(scope === 'distributor' ? { precioVenta: Number(price) } : {}), tipoStock: scope === 'global' ? 'VENTA' : type } });
      setEmail(''); setPassword(''); setProfilePin(''); setPrice(''); onSuccess?.(account);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo guardar la cuenta.'); }
  }
  const field = 'mt-1 block h-11 w-full rounded-xl border bg-background px-3 text-sm';
  return <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-5"><div><h2 className="text-xl font-bold">Agregar cuenta</h2><p className="mt-1 text-sm text-muted-foreground">{scope === 'global' ? 'Stock global' : 'Inventario de tu tienda'}</p></div><label className="block text-sm font-medium">Servicio<select required value={serviceId} onChange={(event) => setServiceId(event.target.value)} className={field}><option value="">Selecciona un servicio</option>{services.data?.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label>{services.error && <p role="alert" className="text-sm text-red-500">No se pudieron cargar los servicios. <button type="button" onClick={() => void services.refetch()} className="underline">Reintentar</button></p>}<label className="block text-sm font-medium">Correo<input required maxLength={150} value={email} onChange={(event) => setEmail(event.target.value)} className={field} /></label><label className="block text-sm font-medium">Contraseña<input type="password" required maxLength={100} value={password} onChange={(event) => setPassword(event.target.value)} className={field} /></label><label className="block text-sm font-medium">Perfil / PIN<input maxLength={20} value={profilePin} onChange={(event) => setProfilePin(event.target.value)} className={field} /></label>{scope === 'distributor' && <><label className="block text-sm font-medium">Precio de venta<input type="number" min="0.01" step="0.01" required value={price} onChange={(event) => setPrice(event.target.value)} className={field} /></label><label className="block text-sm font-medium">Tipo de stock<select value={type} onChange={(event) => setType(event.target.value as StockType)} className={field}><option value="VENTA">Venta</option><option value="GARANTIA">Garantía</option></select></label></>}{error && <p role="alert" className="text-sm text-red-500">{error}</p>}<button disabled={create.isPending || !services.data?.length} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{create.isPending && <LoaderCircle size={16} className="animate-spin" />}{create.isPending ? 'Guardando...' : 'Guardar cuenta'}</button></form>;
}
