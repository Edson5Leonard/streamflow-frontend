'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { StoreProduct } from '@/features/stores/types/stores.types';
import { usePublicCheckout } from '@/features/payments/hooks/usePublicCheckout';
import type { PaymentMethod } from '@/features/payments/types/payments.types';
import { PaymentMethodSelector } from '@/features/payments/components/PaymentMethodSelector';
import { PaymentInstructions } from '@/components/payments/PaymentInstructions';
import { env } from '@/config/env';
import { formatCurrency } from '@/utils/format-currency';
import { trackingHref } from '../../../components/tracking-links';
import { StoreCartDialog } from './StoreCartDialog';

type Props = {
  distributorId: string;
  products: StoreProduct[];
  quantities: Record<string, number>;
  change: (product: StoreProduct, delta: number) => void;
};

export function PublicCart({ distributorId, products, quantities, change }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('YAPE');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');
  const checkout = usePublicCheckout();
  const router = useRouter();
  const selected = products.filter(p => quantities[p.servicioId] > 0);
  const total = selected.reduce((sum, p) => sum + p.precio * quantities[p.servicioId], 0);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checkout.isPending || receipt) return;
    setError('');
    const data = new FormData(event.currentTarget);
    const file = data.get('archivo');
    if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024) {
      setError('Adjunta un comprobante de hasta 5 MB.');
      return;
    }
    if (selected.some(p => quantities[p.servicioId] > p.stockDisponible)) {
      setError('Ajusta las cantidades al stock disponible.');
      return;
    }
    const units = selected.flatMap(p => Array.from({ length: quantities[p.servicioId] }, () => p));
    const whatsapp = String(data.get('telefono') || '').replace(/\D/g, '');
    const codigoOperacion = String(data.get('codigo') || '').trim();
    if (whatsapp.length < 8 || whatsapp.length > 15) {
      setError('El WhatsApp debe tener entre 8 y 15 dígitos.');
      return;
    }
    if (method !== 'INTERNACIONAL' && !codigoOperacion) {
      setError('Ingresa el código de operación del comprobante.');
      return;
    }
    try {
      const result = await checkout.mutateAsync({
        distribuidorId: distributorId, servicioIds: units.map(p => p.servicioId), comprobante: file,
        metodoPago: method, codigoOperacion,
        nombreCompleto: String(data.get('nombre') || ''), whatsapp,
      });
      const orders = result.map((item, index) => ({ id: item.id, tokenPublico: item.tokenPublico, nombreServicio: units[index]?.nombre }));
      if (!orders.length) throw new Error('No se recibió un enlace de seguimiento.');
      const href = trackingHref(orders[0], orders);
      setReceipt(href);
      router.push(href);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo enviar el pedido.'); }
  }
  const count = selected.reduce((sum, product) => sum + quantities[product.servicioId], 0);
  const field = 'mt-1 block w-full min-w-0 rounded-xl border bg-background px-3 py-2.5 focus-visible:outline-violet-500';
  return <StoreCartDialog busy={checkout.isPending} total={total} count={count}>
    {!selected.length ? <p className="text-muted-foreground">Agrega un servicio del catálogo para iniciar tu pedido.</p> :
    <form onSubmit={submit}>
      <fieldset disabled={checkout.isPending || !!receipt} className="space-y-5">
        {selected.map(p => <div key={p.servicioId} className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <strong>{p.nombre}</strong><div className="flex items-center gap-3">
            <button type="button" aria-label={'Quitar una unidad de '+p.nombre} onClick={() => change(p,-1)}>−</button>
            <span>{quantities[p.servicioId]}</span>
            <button type="button" disabled={count >= 20 || quantities[p.servicioId] >= p.stockDisponible} aria-label={'Añadir una unidad de '+p.nombre} onClick={() => change(p,1)}>+</button>
            <span>{formatCurrency(p.precio * quantities[p.servicioId])}</span>
          </div></div>)}
        <p className="text-right text-lg font-bold">Total {formatCurrency(total)}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>Nombre completo<input required minLength={2} name="nombre" autoComplete="name" className={field}/></label>
          <label>WhatsApp<input required minLength={6} name="telefono" type="tel" autoComplete="tel" className={field}/></label>
        </div>
        {env.useMocks ? <><PaymentMethodSelector value={method} onChange={setMethod}/><p className="text-sm text-muted-foreground">Modo de prueba. Adjunta un archivo de ejemplo sin realizar una transferencia.</p></> :
          <PaymentInstructions metodo={method} onMetodoChange={setMethod}/>}
        <label className="block">Código de operación {method === 'INTERNACIONAL' && '(opcional)'}<input name="codigo" required={method !== 'INTERNACIONAL'} maxLength={100} className={field}/></label>
        <label className="block">Comprobante (JPG, PNG o PDF)<input name="archivo" type="file" required accept="image/png,image/jpeg,application/pdf" className={field}/></label>
        <button className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white disabled:opacity-60">{checkout.isPending ? 'Enviando…' : 'Enviar pedido'}</button>
      </fieldset>
      {error && <p role="alert" className="mt-3 text-destructive">{error}</p>}
      {receipt && <Link className="underline" href={receipt}>Ver seguimiento</Link>}
    </form>}
  </StoreCartDialog>;
}
