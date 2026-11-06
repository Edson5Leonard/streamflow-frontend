export type CategoriaFallo =
  | 'CAIDA'
  | 'CORREO_NO_EXISTE'
  | 'CLAVE_INCORRECTA'
  | 'OTRO'
  | 'Contraseña Incorrecta'
  | 'Perfil Bloqueado / PIN Cambiado'
  | 'Suscripción Vencida Antes de Tiempo'
  | 'Contraseña incorrecta'
  | 'Perfil bloqueado / PIN cambiado'
  | 'Suscripción vencida antes de tiempo';
export type EstadoReclamo =
  | 'PENDIENTE'
  | 'PENDIENTE_AUDITORIA'
  | 'REEMPLAZADO_PENDIENTE_AUDITORIA'
  | 'EXPRESS_REEMPLAZADO'
  | 'RECHAZADO'
  | 'RESUELTO'
  | 'DESCARTADO'
  | 'RECUPERADO';

export interface Reclamo {
  id: string;
  usuarioId: string;
  ventaId: string;
  categoriaFallo: CategoriaFallo;
  motivo: string;
  servicio: string;
  correoAfectado: string;
  cuentaDefectuosaId: string;
  comprobanteFalloUrl: string;
  cuentaReemplazoId?: string;
  estado: EstadoReclamo;
  fechaCreacion: string;
}