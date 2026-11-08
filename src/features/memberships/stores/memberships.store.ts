import { create } from 'zustand';
type MembershipState = { selectedPaymentId: string | null; selectPayment: (id: string | null) => void };
export const useMembershipsStore = create<MembershipState>((set) => ({ selectedPaymentId: null, selectPayment: (selectedPaymentId) => set({ selectedPaymentId }) }));
