import { fetchApi } from '@/lib/api';
import { distributorStatisticsSchema, globalStatisticsSchema } from '../schemas/statistics.schema';
export const statisticsApi = {
  async distributor() { return distributorStatisticsSchema.parse(await fetchApi<unknown>('/estadisticas/distribuidor')); },
  async global() { return globalStatisticsSchema.parse(await fetchApi<unknown>('/estadisticas/admin')); },
};
