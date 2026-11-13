export type Claim = { id: string; usuarioId: string | null; clienteId?: string | null; ventaId: string; categoriaFallo: string; comprobanteFalloUrl: string; cuentaDefectuosaId: string | null; cuentaReemplazoId: string | null; motivo: string; estado: string; fechaCreacion: string };
export type GuaranteeReplacement = { cuentaId: string; servicio: string; correo: string; password: string; perfilPin: string | null };
export type AutoGuaranteeResult = { reclamoId: string; ventaId: string; estado: string; mensaje: string; reemplazo: GuaranteeReplacement | null };
export type ClaimInput = { ventaId: string; categoriaFallo: string; motivo: string; archivo: File };
export type PublicClaimInput = { pagoId: string; token: string; categoriaFallo: string; motivo: string; archivo: File };
export type ReplacementInput = { ventaId: string; categoriaFallo: string; motivo: string; comprobanteFalloUrl: string };
export type ClaimStatusUpdate = { id: string; estado: 'RESUELTO' | 'RECHAZADO' };
