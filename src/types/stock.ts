export type TipoStock = 'VENTA' | 'GARANTIA';
export type EstadoCuenta = 'DISPONIBLE' | 'VENDIDO' | 'OBSERVADO' | 'DESCARTADO';

export interface Cuenta {
  id: string;
  servicio: string;
  correo: string;
  password: string;
  perfil?: string;
  pin?: string;
  tipoUso: TipoStock;
  estado: EstadoCuenta;
  fechaVencimiento?: string;
}