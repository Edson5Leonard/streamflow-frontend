import { create } from 'zustand';
type SalesState = { search: string; setSearch: (search: string) => void };
export const useSalesStore = create<SalesState>((set) => ({ search: '', setSearch: (search) => set({ search }) }));
