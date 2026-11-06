export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface Pago {
  id: string;
  compradorId: string;
  distribuidorId: string;
  servicioId: string;
  metodoPago: 'YAPE' | 'PLIN' | 'BCP' | 'INTERBANK' | 'INTERNACIONAL';
  monto: number;
  codigoOperacion: string | null;
  comprobanteUrl: string;
  estado: EstadoPago;
  fechaSolicitud: string;
  motivoRechazo?: string | null;
}