'use client';

import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { RoleNavigation } from '@/components/navigation/RoleNavigation';
import { StreamFlowBrand } from '@/components/navigation/StreamFlowBrand';
import { useSidebar } from '@/contexts/SidebarProvider';
import { handleLogout } from '@/lib/auth';
import type { UserRole } from '@/constants/roles.constants';

export const workspaceLabels: Record<UserRole, string> = {
  COMPRADOR: 'Espacio personal', DISTRIBUIDOR: 'Gestión de tienda', SUPER_ADMIN: 'Administración global',
};

export function Sidebar({ role }: { role: UserRole }) {
  const { isOpen, toggle } = useSidebar();
  return (
    <aside className="sf-side hidden md:flex" data-expanded={isOpen} aria-label="Panel lateral">
      <div className="sf-side-brand">
        <StreamFlowBrand compact={!isOpen} />
        {isOpen && <button type="button" className="sf-rail-button" aria-label="Contraer barra lateral" onClick={toggle}><PanelLeftClose size={17} /></button>}
      </div>
      <div className="sf-side-scroll">
        {isOpen ? <div className="sf-workspace"><span>{workspaceLabels[role]}</span></div> :
          <button type="button" className="sf-rail-button" aria-label="Expandir barra lateral" onClick={toggle}><PanelLeftOpen size={18} /></button>}
        <RoleNavigation role={role} collapsed={!isOpen} />
      </div>
      <div className="sf-side-bottom">
        <button type="button" className="sf-logout" onClick={handleLogout} title="Cerrar sesión">
          <LogOut size={18} /><span className={!isOpen ? 'sr-only' : undefined}>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
