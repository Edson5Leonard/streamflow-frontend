import { create } from 'zustand';
type AuditState = { selectedEventId: string | null; search: string; status: string; selectEvent: (id: string | null) => void; setSearch: (search: string) => void; setStatus: (status: string) => void; resetFilters: () => void };
export const useAuditStore = create<AuditState>((set) => ({ selectedEventId: null, search: '', status: '', selectEvent: (selectedEventId) => set({ selectedEventId }), setSearch: (search) => set({ search }), setStatus: (status) => set({ status }), resetFilters: () => set({ search: '', status: '' }) }));
