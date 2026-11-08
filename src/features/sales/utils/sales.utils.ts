import type { Sale } from '../types/sales.types';
export const sumSalesRevenue = (sales: Sale[]) => sales.reduce((total, sale) => total + sale.precioPagado, 0);
