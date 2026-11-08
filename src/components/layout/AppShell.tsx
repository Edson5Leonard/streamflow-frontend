'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { Footer } from './Footer';
import { MobileNavbar } from './MobileNavbar';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import type { UserRole } from '@/constants/roles.constants';
import './dashboard-shell.css';

export function AppShell({ children, title, role }: { children: ReactNode; title?: string; role: UserRole }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  return <div className="sf-console flex min-h-dvh text-foreground">
    <Sidebar role={role} />
    <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
      <Navbar title={title} role={role} onOpenMobileMenu={() => setMobileOpen(true)} />
      <MobileNavbar role={role} open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="relative flex flex-1 flex-col"><motion.div key={pathname} className="flex flex-1 flex-col" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}>{children}</motion.div></main>
      <Footer />
    </div>
  </div>;
}
