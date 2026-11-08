import { create } from 'zustand';
type ReplenishmentsState = { selectedId: string | null; select: (id: string | null) => void };
export const useReplenishmentsStore = create<ReplenishmentsState>((set) => ({ selectedId: null, select: (selectedId) => set({ selectedId }) }));
