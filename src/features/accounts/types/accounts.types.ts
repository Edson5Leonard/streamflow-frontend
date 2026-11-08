export type StockType = 'VENTA' | 'GARANTIA';
export type Account = { id: string; servicioId: string; correo: string; password: string; perfilPin: string | null; precioVenta: number | null; tipoStock: StockType; estado: string; fechaIngreso: string | null };
export type AvailableAccount = Pick<Account, 'id' | 'servicioId' | 'precioVenta' | 'estado'>;
export type AccountInput = { servicioId: string; correo: string; password: string; perfilPin?: string | null; precioVenta?: number; tipoStock: StockType };
export type AccountUpdate = { correo: string; password: string; perfilPin?: string | null; precioVenta?: number };
export type AccountScope = 'global' | 'distributor';
