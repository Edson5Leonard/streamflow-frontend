import { create } from 'zustand';
type UsersState = { search: string; setSearch: (search: string) => void };
export const useUsersStore = create<UsersState>((set) => ({ search: '', setSearch: (search) => set({ search }) }));
