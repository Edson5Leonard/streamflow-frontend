export type Service = { id: string; nombre: string; categoria: string; descripcion: string | null; precioMayorista: number; precioReposicion: number | null; activo: boolean };
export type CreateServiceInput = { nombre: string; categoria: string; descripcion?: string | null; precioMayorista: number; precioReposicion?: number | null; activo: boolean };
export type UpdateServicePriceInput = { id: string; precioReposicion: number };
