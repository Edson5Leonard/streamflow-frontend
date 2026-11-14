export type Sale = { id: string; compradorId: string | null; cuentaStockId: string; precioPagado: number; pagoId: string | null; fechaVenta: string };
export type Purchase = { id: string; cuentaStockId: string; servicio: string; correo: string; password: string; perfilPin: string | null; precioPagado: number; fechaVenta: string };
