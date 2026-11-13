import { z } from 'zod';
export const statisticsRangeSchema = z.enum(['7d', '30d', '90d', '12m']);
export const distributorStatisticsSchema = z.object({ ingresosTotales: z.number(), ingresosHoy: z.number(), ventasHoy: z.number(), stockDisponible: z.number(), pagosPorRevisar: z.number() });
export const globalStatisticsSchema = z.object({ ingresosRed: z.number(), ventasHoy: z.number(), ingresosMembresias: z.number(), distribuidoresActivos: z.number(), distribuidoresSuspendidos: z.number() });
