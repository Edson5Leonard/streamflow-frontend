export type UserRole = 'SUPER_ADMIN' | 'DISTRIBUIDOR' | 'COMPRADOR';
export type Session = { token: string; usuarioId: string; role: UserRole; distribuidorId?: string | null };
export type LoginInput = { correo: string; password: string };
export type RegisterInput = { nombreCompleto: string; correo: string; password: string; whatsapp?: string; distribuidorId: string };
export type SessionProfile = { usuarioId: string; nombreCompleto: string; correo: string; whatsapp: string | null; role: string; roles: string[]; distribuidorId: string | null; distribuidorWhatsapp: string | null };
