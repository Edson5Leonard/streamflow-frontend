'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Package, 
  ClipboardCheck, 
  ShoppingBag, 
  History, 
  HelpCircle,
  Tv
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const adminLinks = [
    { href: '/admin/pedidos', label: 'Pedidos pendientes', icon: ShieldCheck },
    { href: '/admin/inventario', label: 'Gestión Inventario', icon: Package },
    { href: '/admin/auditoria', label: 'Auditoría Nocturna', icon: ClipboardCheck },
  ];

  const clientLinks = [
    { href: '/dashboard/catalogo', label: 'Catálogo Cuentas', icon: ShoppingBag },
    { href: '/dashboard/historial', label: 'Mis Compras / Reclamos', icon: History },
    { href: '/dashboard/soporte', label: 'Soporte y Ayuda', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen p-4 flex flex-col justify-between border-r border-slate-800">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base leading-none text-white">StreamManager</h2>
            <span className="text-xs text-slate-400">Panel de Control</span>
          </div>
        </div>

        {/* Módulo Administrador */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Administración
          </p>
          <nav className="space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Módulo Cliente / Revendedor */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Portal Revendedor
          </p>
          <nav className="space-y-1">
            {clientLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

    </aside>
  );
}