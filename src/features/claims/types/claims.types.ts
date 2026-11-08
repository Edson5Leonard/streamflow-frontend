export type Claim = { id: string; usuarioId: string; ventaId: string; categoriaFallo: string; comprobanteFalloUrl: string; cuentaDefectuosaId: string | null; cuentaReemplazoId: string | null; motivo: string; estado: string; fechaCreacion: string };
export type ClaimInput = { ventaId: string; categoriaFallo: string; motivo: string; archivo: File };
export type PublicClaimInput = { pagoId: string; token: string; categoriaFallo: string; motivo: string; archivo: File };
export type ReplacementInput = { ventaId: string; categoriaFallo: string; motivo: string; comprobanteFalloUrl: string };
export type ClaimStatusUpdate = { id: string; estado: 'RESUELTO' | 'RECHAZADO' };
