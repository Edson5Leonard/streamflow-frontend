'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PanelLeft, UserRound } from 'lucide-react';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { useSidebar } from '@/contexts/SidebarProvider';
import { getNavigationForRole } from '@/config/navigation.config';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { getInitials } from '@/utils/get-initials';
import type { UserRole } from '@/constants/roles.constants';

const profileRoutes: Record<UserRole, string> = {
  SUPER_ADMIN: '/superadmin/perfil', DISTRIBUIDOR: '/admin/configuracion', COMPRADOR: '/dashboard/perfil',
};

export function Navbar({ title = 'StreamFlow', onOpenMobileMenu, role }: {
  title?: string; onOpenMobileMenu?: () => void; role: UserRole;
}) {
  const { toggle, isOpen } = useSidebar();
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const current = getNavigationForRole(role).filter(item => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a,b) => b.href.length - a.href.length)[0];
  const initials = getInitials(profile?.nombreCompleto ?? '');
  return (
    <header className="sf-console-header">
      <div className="sf-console-bar">
        <button type="button" className="sf-console-control hidden md:inline-flex" aria-label="Alternar menú lateral" aria-expanded={isOpen} onClick={toggle}><PanelLeft size={18} /></button>
        <button type="button" className="sf-console-control inline-flex md:hidden" aria-label="Abrir menú" aria-haspopup="dialog" onClick={onOpenMobileMenu}><Menu size={19} /></button>
        <div className="sf-console-location">
          <small>{title}</small><strong key={pathname}>{current?.label ?? title}</strong>
        </div>
        <ThemeToggle />
        <Link href={profileRoutes[role]} className="sf-profile-trigger" aria-label="Abrir mi perfil" title="Mi perfil">
          <span className="sf-avatar">{initials || <UserRound size={17} />}</span>
          <span className="sf-profile-text"><strong>{profile?.nombreCompleto || 'Mi cuenta'}</strong><small>Mi perfil</small></span>
        </Link>
      </div>
    </header>
  );
}
