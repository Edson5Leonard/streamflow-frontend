import type { GlobalStatistics } from '../types/statistics.types';

// El backend calcula estas métricas desde usuarios y membresías.
// Hasta integrar esos datos mock, se muestran valores de demostración.
export const globalStatisticsMock: Pick<GlobalStatistics, 'ingresosMembresias' | 'distribuidoresActivos' | 'distribuidoresSuspendidos'> = {
  ingresosMembresias: 30,
  distribuidoresActivos: 1,
  distribuidoresSuspendidos: 0,
};
