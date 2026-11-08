import type { BuyerOrder, Payment } from '../types/payments.types';
export type MockPayment = Payment & { tokenPublico: string; nombreServicio: string; voucherData?: string };
export const paymentsMock: MockPayment[] = [];
export const buyerOrdersMock: BuyerOrder[] = [];
