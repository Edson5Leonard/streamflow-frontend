import { env } from './env';

export const appConfig = { name: env.appName, description: 'Gestión de tiendas, cuentas y ventas de streaming.', locale: 'es-PE', currency: 'PEN' } as const;
