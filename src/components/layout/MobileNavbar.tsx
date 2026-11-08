'use client';

import { LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RoleNavigation } from '@/components/navigation/RoleNavigation';
import { StreamFlowBrand } from '@/components/navigation/StreamFlowBrand';
import { handleLogout } from '@/lib/auth';
import type { UserRole } from '@/constants/roles.constants';
import { workspaceLabels } from './Sidebar';

export function MobileNavbar({ open, onClose, role }: { open: boolean; onClose: () => void; role: UserRole }) {
  return (
    <Dialog open={open} onOpenChange={next => { if (!next) onClose(); }}>
      <DialogContent className="sf-mobile-side">
        <div className="sf-side-brand"><StreamFlowBrand onNavigate={onClose} /></div>
        <DialogTitle className="sr-only">{workspaceLabels[role]}</DialogTitle>
        <DialogDescription className="sr-only">Secciones disponibles para tu cuenta</DialogDescription>
        <div className="sf-side-scroll">
          <div className="sf-workspace"><span>{workspaceLabels[role]}</span></div>
          <RoleNavigation role={role} onNavigate={onClose} />
        </div>
        <div className="sf-side-bottom"><button type="button" className="sf-logout" onClick={handleLogout}><LogOut size={18} />Cerrar sesión</button></div>
      </DialogContent>
    </Dialog>
  );
}
