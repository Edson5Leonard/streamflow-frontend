export type CategoriaFallo = 'CAIDA' | 'CORREO_NO_EXISTE' | 'CLAVE_INCORRECTA' | 'OTRO';
export type EstadoReclamo = 'PENDIENTE_AUDITORIA' | 'RESUELTO_DESCARTADO' | 'RESUELTO_RECUPERADO';

export interface Reclamo {
  id: string;
  ventaId: string;
  servicio: string;
  correoAfectado: string;
  categoriaFallo: CategoriaFallo;
  comentarioCliente?: string;
  comprobanteFalloUrl: string;
  cuentaReemplazoId?: string;
  estado: EstadoReclamo;
  fechaReporte: string;
}