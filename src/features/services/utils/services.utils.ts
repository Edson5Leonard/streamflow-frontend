import type { Service } from '../types/services.types';
export const getActiveServices = (items: Service[]) => items.filter((item) => item.activo);
