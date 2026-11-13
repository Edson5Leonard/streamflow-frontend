'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { LoaderCircle, Upload } from 'lucide-react';
import { getStoreImageSrc } from '@/features/stores/utils/stores.utils';
import { storesService } from '@/features/stores/services/stores.service';
import { useStoreSettingsMutation } from '@/features/stores/hooks/useStoreSettingsMutation';
import type { StoreManagement, StorePaymentMethod } from '@/features/stores/types/stores.types';
import { StoreProductsManager } from './StoreProductsManager';

const field = 'mt-1 h-10 w-full rounded-xl border border-slate-200 bg-background px-3 text-sm dark:border-white/10';
const paymentLabels: Record<StorePaymentMethod['metodo'], string> = {
  YAPE: 'Yape',
  PLIN: 'Plin',
  BCP: 'BCP',
  INTERBANK: 'Interbank',
  INTERNACIONAL: 'Internacional',
};

function ImagePreview({ url, alt }: { url: string | null; alt: string }) {
  const src = getStoreImageSrc(url);
  return src ? <Image unoptimized src={src} alt={alt} width={192} height={144} className="max-h-36 max-w-48 rounded-xl border object-contain" /> : null;
}

export function StoreSettingsForm({ store }: { store: StoreManagement }) {
  const mutation = useStoreSettingsMutation();
  const [name, setName] = useState(store.nombreTienda);
  const [description, setDescription] = useState(store.descripcion ?? '');
  const [logoUrl, setLogoUrl] = useState(store.logoUrl);
  const [whatsapp, setWhatsapp] = useState(store.whatsapp ?? '');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  async function uploadLogo(file?: File) {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      setLogoUrl(await storesService.uploadImage(file, 'logo'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo subir el logo.');
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await mutation.mutateAsync(() => storesService.updateMyStore({
        nombreTienda: name.trim(),
        descripcion: description.trim() || null,
        logoUrl,
        whatsapp: whatsapp.trim() || null,
      }));
      setMessage('Datos de la tienda guardados.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudieron guardar los datos.');
    }
  }

  return <section className="space-y-5 rounded-2xl border bg-card p-5">
    <div><h2 className="text-lg font-bold">Perfil de la tienda</h2><p className="text-sm text-muted-foreground">Los cambios se reflejan en la tienda pública.</p></div>
    <form onSubmit={saveProfile} className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium">Nombre de la tienda<input required maxLength={120} value={name} onChange={event => setName(event.target.value)} className={field} /></label>
      <label className="text-sm font-medium">WhatsApp de la tienda<input type="tel" maxLength={20} value={whatsapp} onChange={event => setWhatsapp(event.target.value)} className={field} placeholder="Ej. +519..." /></label>
      <label className="text-sm font-medium md:col-span-2">Descripción<textarea maxLength={1000} value={description} onChange={event => setDescription(event.target.value)} className={`${field} min-h-24 py-2`} /></label>
      <div className="space-y-2 text-sm font-medium md:col-span-2">
        <span>Logo</span>
        <div className="flex flex-wrap items-center gap-3">
          <ImagePreview url={logoUrl} alt="Logo de la tienda" />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold">
            {uploading ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />} Subir imagen
            <input hidden type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={event => void uploadLogo(event.target.files?.[0])} />
          </label>
          {logoUrl && <button type="button" className="text-xs underline" onClick={() => setLogoUrl(null)}>Quitar logo</button>}
        </div>
        <p className="text-xs font-normal text-muted-foreground">PNG, JPG o WEBP, máximo 5 MB.</p>
      </div>
      {error && <p role="alert" className="text-sm text-red-500 md:col-span-2">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-600 md:col-span-2">{message}</p>}
      <button disabled={mutation.isPending || uploading} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white disabled:opacity-50 md:col-span-2">
        {mutation.isPending && <LoaderCircle size={15} className="animate-spin" />} Guardar perfil
      </button>
    </form>
    <StoreProductsManager products={store.productos} />
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Métodos de pago</h2>
      <p className="text-sm text-muted-foreground">Activa solo los medios que aceptas y configura los datos que verá el comprador.</p>
      <div className="grid gap-4 xl:grid-cols-2">
        {store.metodosPago.map(method => <PaymentMethodEditor key={method.metodo} method={method} />)}
      </div>
    </div>
  </section>;
}

function PaymentMethodEditor({ method }: { method: StorePaymentMethod }) {
  const mutation = useStoreSettingsMutation();
  const [form, setForm] = useState(method);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  async function upload(file?: File) {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const imagenQrUrl = await storesService.uploadImage(file, 'metodo-pago', undefined, method.metodo);
      setForm(current => ({ ...current, imagenQrUrl }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo subir el QR.');
    } finally {
      setUploading(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await mutation.mutateAsync(() => storesService.updatePaymentMethod(form));
      setMessage('Método de pago guardado.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar el método.');
    }
  }

  const label = paymentLabels[method.metodo];
  return <form onSubmit={save} className="space-y-3 rounded-xl border p-4">
    <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{label}</h3><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.activo} onChange={event => setForm(current => ({ ...current, activo: event.target.checked }))} /> Activo</label></div>
    {(method.metodo === 'YAPE' || method.metodo === 'PLIN') && <div className="space-y-2"><ImagePreview url={form.imagenQrUrl} alt={`QR ${label}`} /><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold"><Upload size={14} /> Subir QR<input hidden type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={event => void upload(event.target.files?.[0])} /></label></div>}
    <label className="block text-sm">Titular<input maxLength={120} value={form.titular ?? ''} onChange={event => setForm(current => ({ ...current, titular: event.target.value || null }))} className={field} /></label>
    <label className="block text-sm">Número de cuenta / teléfono<input maxLength={80} value={form.numeroCuenta ?? ''} onChange={event => setForm(current => ({ ...current, numeroCuenta: event.target.value || null }))} className={field} /></label>
    <label className="block text-sm">CCI<input maxLength={30} value={form.cci ?? ''} onChange={event => setForm(current => ({ ...current, cci: event.target.value || null }))} className={field} /></label>
    {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
    {message && <p role="status" className="text-xs text-emerald-600">{message}</p>}
    <button disabled={mutation.isPending || uploading} className="h-9 rounded-lg bg-violet-600 px-3 text-xs font-semibold text-white disabled:opacity-50">{mutation.isPending ? 'Guardando…' : 'Guardar método'}</button>
  </form>;
}
