'use client';

import { useRef, type ReactNode } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { formatCurrency } from '@/utils/format-currency';

export function StoreCartDialog({ count, total, children, busy }: {
  count: number; total: number; children: ReactNode; busy: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="sf-shop-cartbar">
        <ShoppingBag size={20} aria-hidden="true" />
        <div><strong>Tu pedido</strong><p>{count} {count === 1 ? 'unidad' : 'unidades'} · {formatCurrency(total)}</p></div>
        <button id="carrito" type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>Ver carrito</button>
      </div>
      <dialog ref={dialog} aria-labelledby="public-cart-title" className="sf-shop-dialog"
        onCancel={event => { if (busy) event.preventDefault(); }}>
        <div className="sf-shop-dialog-heading">
          <h2 id="public-cart-title">Tu carrito</h2>
          <button type="button" disabled={busy} onClick={() => dialog.current?.close()} aria-label="Cerrar carrito"><X size={19} /></button>
        </div>
        {children}
      </dialog>
    </>
  );
}
