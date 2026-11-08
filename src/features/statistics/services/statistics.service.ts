import { env } from '@/config/env';
import { accountsService } from '@/features/accounts/services/accounts.service';
import { salesService } from '@/features/sales/services/sales.service';
import { statisticsApi } from '../api/statistics.api';
import { globalStatisticsMock } from '../mocks/statistics.mock';
import { isToday } from '../utils/statistics.utils';

export const statisticsService = {
  async distributor() {
    if (!env.useMocks) return statisticsApi.distributor();
    const [sales, accounts] = await Promise.all([salesService.list(), accountsService.list()]);
    const today = sales.filter((sale) => isToday(sale.fechaVenta));
    return { ingresosTotales: sales.reduce((sum, sale) => sum + sale.precioPagado, 0), ingresosHoy: today.reduce((sum, sale) => sum + sale.precioPagado, 0), ventasHoy: today.length, stockDisponible: accounts.filter((account) => account.estado === 'DISPONIBLE' && account.tipoStock === 'VENTA').length };
  },
  async global() {
    if (!env.useMocks) return statisticsApi.global();
    const sales = await salesService.list();
    return { ...globalStatisticsMock, ingresosRed: sales.reduce((sum, sale) => sum + sale.precioPagado, 0), ventasHoy: sales.filter((sale) => isToday(sale.fechaVenta)).length };
  },
};
