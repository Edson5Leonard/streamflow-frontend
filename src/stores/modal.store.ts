import { create } from 'zustand';

type ModalState = { activeModal: string | null; payload: unknown; open: (name: string, payload?: unknown) => void; close: () => void };
export const useModalStore = create<ModalState>((set) => ({
  activeModal: null, payload: null,
  open: (activeModal, payload = null) => set({ activeModal, payload }),
  close: () => set({ activeModal: null, payload: null }),
}));
