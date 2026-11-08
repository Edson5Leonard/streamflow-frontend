import { create } from 'zustand';

export type CartItem = { serviceId: string; quantity: number };

type CartState = {
  items: CartItem[];
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  clear: () => set({ items: [] }),
}));
