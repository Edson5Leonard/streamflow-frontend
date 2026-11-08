'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import { useStoreCatalog } from '@/features/stores/hooks/useStoreCatalog';
import type { StoreCatalog } from '@/features/stores/types/stores.types';
import { getStoreHref } from '@/features/stores/utils/stores.utils';
import { usePublicCheckout } from '@/features/payments/hooks/usePublicCheckout';
import { PaymentInstructions } from '@/components/payments/PaymentInstructions';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { SlideIn } from '@/components/animation/SlideIn';
import { CART_LIMIT, emptyDraft, useCartItems, useCartStore } from '@/stores/cart.store';
import { formatCurrency } from '@/utils/format-currency';
import { trackingHref } from '../../../components/tracking-links';
import { useConfirmation } from '../../../components/PurchaseConfirmation';
import { CartServiceLine } from './CartServiceLine';
import './storefront.css';

export function PublicCart({ distributorId }: { distributorId: string }) {
  const catalog = useStoreCatalog(distributorId);
  if (catalog.isPending) return <LoadingState label="Cargando carrito" />;
  if (catalog.error || !catalog.data || !Array.isArray(catalog.data.productos)) {
    return <ErrorState title="No pudimos cargar los productos de esta tienda"
      description={catalog.error?.message} onRetry={() => void catalog.refetch()} />;
  }
  return <CheckoutContents distributorId={distributorId} catalog={catalog.data} />;
}

export function CheckoutContents({ distributorId, catalog, singleId, modal = false, onBusy, onContinue }: {
  distributorId: string; catalog: StoreCatalog; singleId?: string; modal?: boolean;
  onBusy?: (busy: boolean) => void; onContinue?: () => void;
}) {
  const cart = useCartItems(distributorId);
  const quantities = singleId ? { [singleId]: 1 } : cart;
  const draftKey = singleId ? distributorId + ':direct' : distributorId;
  const draft = useCartStore(state => state.drafts[draftKey] ?? emptyDraft);
  const { change, editDraft, clear } = useCartStore.getState();
  const checkout = usePublicCheckout();
  const router = useRouter();
  const submitting = useRef(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');
  const storeUrl = getStoreHref(distributorId);
  const products = catalog.productos;
  const selected = products.filter(product => quantities[product.servicioId] > 0);
  const missing = Object.keys(quantities).filter(id => !products.some(product => product.servicioId === id));
  const count = Object.values(quantities).reduce((sum, n) => sum + n, 0);
  const total = selected.reduce((sum, product) => sum + product.precio * quantities[product.servicioId], 0);
  const invalid = missing.length > 0 || selected.some(product => quantities[product.servicioId] > product.stockDisponible);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || receipt) return;
    setError('');
    const phone = draft.phone.replace(/\D/g, '');
    const code = draft.code.trim();
    if (!count || count > CART_LIMIT || invalid) return setError('Revisa el stock y las cantidades de tu pedido.');
    if (phone.length < 8 || phone.length > 15) return setError('El WhatsApp debe tener entre 8 y 15 dígitos.');
    if (draft.method !== 'INTERNACIONAL' && !code) return setError('Ingresa el código de operación.');
    if (!draft.file?.size || draft.file.size > 5 * 1024 * 1024) return setError('Adjunta un comprobante de hasta 5 MB.');
    submitting.current = true;
    onBusy?.(true);
    const units = selected.flatMap(product => Array.from({ length: quantities[product.servicioId] }, () => product));
    try {
      const result = await checkout.mutateAsync({
        distribuidorId: distributorId, servicioIds: units.map(product => product.servicioId), comprobante: draft.file,
        metodoPago: draft.method, codigoOperacion: code, nombreCompleto: draft.name.trim(), whatsapp: phone,
      });
      const orders = result.map((item, index) => ({ id: item.id, tokenPublico: item.tokenPublico, nombreServicio: units[index]?.nombre }));
      if (!orders.length) throw new Error('No se recibió un enlace de seguimiento.');
      const href = trackingHref(orders[0], orders);
      setReceipt(href);
      useConfirmation.getState().save({
        ids: orders.map(order => order.id), store: catalog.nombreTienda,
        customer: draft.name.trim(), phone, method: draft.method, operation: code,
        total: result.reduce((sum, payment) => sum + payment.monto, 0),
        items: selected.map(p => `${quantities[p.servicioId]} × ${p.nombre} (${formatCurrency(p.precio)} c/u)`),
      });
      if (singleId) editDraft(draftKey, emptyDraft);
      else clear(distributorId);
      router.push(href);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo enviar el pedido.');
      submitting.current = false;
      onBusy?.(false);
    }
  }

  return (
    <div className="sf-cart-page">
      {!modal && <header className="sf-cart-hero">
        <SlideIn>
          <Link href={storeUrl} className="sf-shop-back"><ArrowLeft size={16} /> Volver a {catalog.nombreTienda}</Link>
          <h1>Tu carrito</h1>
          <p>{catalog.nombreTienda}</p>
        </SlideIn>
        <ShoppingCart size={56} strokeWidth={1.25} aria-hidden="true" />
      </header>}
      {receipt ? <div role="status" className="sf-cart-panel"><h2>Pedido enviado</h2><Link href={receipt}>Ver seguimiento →</Link></div> :
        !count ? <section className="sf-cart-panel sf-cart-empty">
          <ShoppingCart size={32} /><h2>Tu carrito está vacío</h2>
          <p>Elige un servicio de esta tienda para comenzar.</p>
          {modal ? <button type="button" className="sf-cart-action" onClick={onContinue}>Seguir comprando</button> :
            <Link className="sf-cart-action" href={storeUrl}>Explorar catálogo <ArrowRight size={16} /></Link>}
        </section> : (
        <form onSubmit={submit} className="sf-cart-grid">
          <fieldset className="sf-cart-panel sf-cart-summary" disabled={checkout.isPending}>
            <h2>{singleId ? 'Tu servicio' : 'Servicios seleccionados'}</h2>
            <ul>{selected.map(product => (
              <CartServiceLine key={product.servicioId} product={product} quantity={quantities[product.servicioId]}
                fixed={!!singleId} full={count >= CART_LIMIT} change={delta => change(distributorId, product.servicioId, delta, product.stockDisponible)} />
            ))}</ul>
            {missing.map(id => <p key={id}>Un servicio ya no está en el catálogo. <button type="button" className="underline"
              onClick={() => change(distributorId, id, -quantities[id], 0)}>Quitar servicio</button></p>)}
            <div className="sf-cart-total"><span>Total · {count} {count === 1 ? 'unidad' : 'unidades'}</span><strong>{formatCurrency(total)}</strong></div>
            {modal ? <button type="button" onClick={onContinue} className="sf-cart-back"><ArrowLeft size={15} /> Seguir comprando</button> :
              <Link href={storeUrl} className="sf-cart-back"><ArrowLeft size={15} /> Seguir comprando</Link>}
          </fieldset>
          <fieldset className="sf-cart-panel sf-cart-checkout" disabled={checkout.isPending}>
            <h2>Completar pedido</h2>
            <label>Nombre completo<input required minLength={2} autoComplete="name" value={draft.name}
              onChange={e => editDraft(draftKey, { name: e.target.value })} /></label>
            <label>WhatsApp<input required type="tel" autoComplete="tel" value={draft.phone}
              onChange={e => editDraft(draftKey, { phone: e.target.value })} /></label>
            <PaymentInstructions metodo={draft.method} onMetodoChange={method => editDraft(draftKey, { method })} />
            <label>Código de operación {draft.method === 'INTERNACIONAL' && '(opcional)'}
              <input required={draft.method !== 'INTERNACIONAL'} maxLength={100} value={draft.code}
                onChange={e => editDraft(draftKey, { code: e.target.value })} /></label>
            <label>Comprobante (JPG, PNG o PDF · hasta 5 MB)
              <input type="file" required={!draft.file} accept="image/png,image/jpeg,application/pdf"
                onChange={e => { if (e.target.files?.[0]) editDraft(draftKey, { file: e.target.files[0] }); }} /></label>
            {draft.file && <small>Archivo seleccionado: {draft.file.name}</small>}
            {error && <p role="alert" className="text-destructive">{error}</p>}
            <button className="sf-cart-action" disabled={invalid || checkout.isPending}>
              {checkout.isPending ? 'Enviando…' : 'Enviar pedido'} <ArrowRight size={16} />
            </button>
          </fieldset>
        </form>
      )}
    </div>
  );
}
