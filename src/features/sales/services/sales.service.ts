import { env } from '@/config/env';
import { salesApi } from '../api/sales.api';
import { salesMock } from '../mocks/sales.mock';
import Cookies from 'js-cookie';
import { saleIdSchema } from '../schemas/sale.schema';
export const salesService = {
  async list() { if (!env.useMocks) return salesApi.list(); const role = Cookies.get('role'); const id = Cookies.get('usuarioId'); return structuredClone(salesMock.filter((item) => role === 'SUPER_ADMIN' || (role === 'DISTRIBUIDOR' && item.distributorId === id)).map((item) => item.sale)); },
  async listMyPurchases() { if (!env.useMocks) return salesApi.listMyPurchases(); const id = Cookies.get('usuarioId'); return structuredClone(salesMock.filter((item) => item.sale.compradorId === id).map((item) => item.purchase)); },
  async getByPayment(paymentId: string) { const id = saleIdSchema.parse(paymentId); if (!env.useMocks) return salesApi.getByPayment(id); const item = salesMock.find((entry) => entry.sale.pagoId === id && entry.sale.compradorId === Cookies.get('usuarioId')); if (!item) throw new Error('La compra aún no está despachada.'); return structuredClone(item.purchase); },
};
