'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getNavigationForRole } from '@/config/navigation.config';
import type { UserRole } from '@/constants/roles.constants';

export function RoleNavigation({ role, collapsed = false, onNavigate }: { role: UserRole; collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = getNavigationForRole(role);
  const active = items.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)).sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return <nav aria-label="Navegación principal" className="sf-side-nav" data-compact={collapsed}>
    {items.map(({ href, label, icon: Icon }) => {
      const selected = active === href;
      return <Link key={href} href={href} onClick={onNavigate} title={collapsed ? label : undefined} aria-current={selected ? 'page' : undefined}
        className="sf-side-link">
        <Icon size={19} strokeWidth={selected ? 2.2 : 1.8} className="shrink-0" />
        <span className={collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'}>{label}</span>
        {!collapsed && selected && <ChevronRight size={15} aria-hidden="true" />}
      </Link>;
    })}
  </nav>;
}
