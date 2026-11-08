import type { Replenishment } from '../types/replenishments.types';
export const calculateRequestedUnits = (request: Replenishment) => request.unidadesSolicitadas;
