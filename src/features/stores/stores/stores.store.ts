import { create } from 'zustand';
import { ALL_CATEGORIES } from '../constants/stores.constants';

type StoreSelection = {
  selectedDistributorId: string | null;
  search: string;
  category: string;
  selectDistributor: (id: string | null) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  resetFilters: () => void;
};
export const useStoreSelection = create<StoreSelection>((set) => ({
  selectedDistributorId: null, search: '', category: ALL_CATEGORIES,
  selectDistributor: (selectedDistributorId) => set({ selectedDistributorId, search: '', category: ALL_CATEGORIES }),
  setSearch: (search) => set({ search }), setCategory: (category) => set({ category }),
  resetFilters: () => set({ search: '', category: ALL_CATEGORIES }),
}));
