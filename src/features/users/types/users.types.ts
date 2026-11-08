export type UserRole = { id: number; nombre: string };
export type User = { id: string; nombreCompleto: string; correo: string; whatsapp: string | null; activo: boolean; membresiaHasta: string | null; fechaCreacion: string | null; roles: UserRole[] };
export type UserUpdate = { nombreCompleto?: string; correo?: string; whatsapp?: string; password?: string; activo?: boolean };
export type CreateDistributor = { nombreCompleto: string; correo: string; password: string; whatsapp?: string };
