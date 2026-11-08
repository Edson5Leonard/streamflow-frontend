import { create } from 'zustand';
type ServicesState = { category: string | null; setCategory: (category: string | null) => void };
export const useServicesStore = create<ServicesState>((set) => ({ category: null, setCategory: (category) => set({ category }) }));
