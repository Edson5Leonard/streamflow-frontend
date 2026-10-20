export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface Pago {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  monto: number;
  comprobanteUrl: string;
  estado: EstadoPago;
  fechaCreacion: string;
}