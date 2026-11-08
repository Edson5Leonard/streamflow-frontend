import { create } from 'zustand';
type AccountsState = { serviceId: string | null; setServiceId: (id: string | null) => void };
export const useAccountsStore = create<AccountsState>((set) => ({ serviceId: null, setServiceId: (serviceId) => set({ serviceId }) }));
