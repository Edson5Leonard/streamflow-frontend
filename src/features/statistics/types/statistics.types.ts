export type DistributorStatistics = { ingresosTotales: number; ingresosHoy: number; ventasHoy: number; stockDisponible: number; pagosPorRevisar: number };
export type GlobalStatistics = { ingresosRed: number; ventasHoy: number; ingresosMembresias: number; distribuidoresActivos: number; distribuidoresSuspendidos: number };
export type StatisticsRange = '7d' | '30d' | '90d' | '12m';
export type SalesPoint = { fecha: string; ventas: number; ingresos: number };
export type InventoryPoint = { estado: string; cantidad: number };
