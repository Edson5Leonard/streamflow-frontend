import type { Payment } from '../types/payments.types';
export const getPendingPayments = (payments: Payment[]) => payments.filter((payment) => payment.estado === 'PENDIENTE');
