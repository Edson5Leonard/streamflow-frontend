'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PaymentMethod } from '@/features/payments/types/payments.types';

export const CART_LIMIT = 20;
type Quantities = Record<string, number>;
type Draft = { method: PaymentMethod; name: string; phone: string; code: string; file: File | null };
const emptyItems: Quantities = {};
export const emptyDraft: Draft = { method: 'YAPE', name: '', phone: '', code: '', file: null };
type CartState = {
  carts: Record<string, Quantities>;
  drafts: Record<string, Draft>;
  change: (store: string, service: string, delta: number, stock: number) => void;
  editDraft: (store: string, fields: Partial<Draft>) => void;
  clear: (store: string) => void;
};

export const useCartStore = create<CartState>()(persist((set) => ({
  carts: {},
  drafts: {},
  change: (store, service, delta, stock) => set(state => {
    const current = state.carts[store] ?? emptyItems;
    const previous = current[service] ?? 0;
    const count = Object.values(current).reduce((sum, quantity) => sum + quantity, 0);
    if (delta > 0 && (previous + delta > stock || count + delta > CART_LIMIT)) return state;
    const items = { ...current };
    const next = Math.max(0, previous + delta);
    if (next) items[service] = next;
    else delete items[service];
    return { carts: { ...state.carts, [store]: items } };
  }),
  editDraft: (store, fields) => set(state => ({
    drafts: { ...state.drafts, [store]: { ...(state.drafts[store] ?? emptyDraft), ...fields } },
  })),
  clear: store => set(state => {
    const carts = { ...state.carts };
    const drafts = { ...state.drafts };
    delete carts[store];
    delete drafts[store];
    return { carts, drafts };
  }),
}), {
  name: 'streamflow:public-cart:v1',
  storage: createJSONStorage(() => sessionStorage),
  partialize: state => ({ carts: state.carts }),
}));

export function useCartItems(store: string) {
  return useCartStore(state => state.carts[store] ?? emptyItems);
}
