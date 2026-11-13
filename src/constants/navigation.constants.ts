import { LayoutDashboard, Package, ShoppingBag, Users, ReceiptText, ShieldCheck, CreditCard, History, LifeBuoy, ClipboardCheck, Store, type LucideIcon } from 'lucide-react';
import type { UserRole } from './roles.constants';
export type NavigationItem = { label: string; href: string; icon: LucideIcon; roles: UserRole[] };
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Resumen', href: '/dashboard', icon: LayoutDashboard, roles: ['COMPRADOR'] },
  { label: 'Catálogo', href: '/dashboard/catalogo', icon: ShoppingBag, roles: ['COMPRADOR'] },
  { label: 'Mis compras', href: '/dashboard/historial', icon: History, roles: ['COMPRADOR'] },
  { label: 'Soporte', href: '/dashboard/soporte', icon: LifeBuoy, roles: ['COMPRADOR'] },
  { label: 'Mi perfil', href: '/dashboard/perfil', icon: Users, roles: ['COMPRADOR'] },
  { label: 'Resumen', href: '/admin', icon: LayoutDashboard, roles: ['DISTRIBUIDOR'] },
  { label: 'Inventario', href: '/admin/inventario', icon: Package, roles: ['DISTRIBUIDOR'] },
  { label: 'Pedidos', href: '/admin/pedidos', icon: ReceiptText, roles: ['DISTRIBUIDOR'] },
  { label: 'Clientes', href: '/admin/clientes', icon: Users, roles: ['DISTRIBUIDOR'] },
  { label: 'Reclamos', href: '/admin/reclamos', icon: LifeBuoy, roles: ['DISTRIBUIDOR'] },
  { label: 'Auditoría', href: '/admin/auditoria', icon: ClipboardCheck, roles: ['DISTRIBUIDOR'] },
  { label: 'Membresía', href: '/admin/membresia', icon: CreditCard, roles: ['DISTRIBUIDOR'] },
  { label: 'Configuración', href: '/admin/configuracion', icon: Store, roles: ['DISTRIBUIDOR'] },
  { label: 'Resumen', href: '/superadmin', icon: LayoutDashboard, roles: ['SUPER_ADMIN'] },
  { label: 'Distribuidores', href: '/superadmin/distribuidores', icon: Store, roles: ['SUPER_ADMIN'] },
  { label: 'Tiendas', href: '/superadmin/tiendas', icon: Store, roles: ['SUPER_ADMIN'] },
  { label: 'Stock global', href: '/superadmin/stock-global', icon: Package, roles: ['SUPER_ADMIN'] },
  { label: 'Pagos de membresía', href: '/superadmin/pagos-suscripcion', icon: CreditCard, roles: ['SUPER_ADMIN'] },
  { label: 'Auditoría', href: '/superadmin/auditoria', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
  { label: 'Servicios', href: '/superadmin/servicios', icon: ShoppingBag, roles: ['SUPER_ADMIN'] },
  { label: 'Estadísticas', href: '/superadmin/estadisticas', icon: LayoutDashboard, roles: ['SUPER_ADMIN'] },
  { label: 'Mi perfil', href: '/superadmin/perfil', icon: Users, roles: ['SUPER_ADMIN'] },
];
