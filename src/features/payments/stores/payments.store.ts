import { create } from 'zustand';
type PaymentsState = { selectedPaymentId: string | null; selectPayment: (id: string | null) => void };
export const usePaymentsStore = create<PaymentsState>((set) => ({ selectedPaymentId: null, selectPayment: (selectedPaymentId) => set({ selectedPaymentId }) }));
