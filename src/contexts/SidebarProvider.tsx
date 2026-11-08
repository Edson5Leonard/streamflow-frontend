'use client';

import type { ReactNode } from 'react';
import { useAppStore } from '@/stores/app.store';

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  return <SidebarContext.Provider value={{ isOpen: isSidebarOpen, toggle: toggleSidebar, setOpen: setSidebarOpen }}>{children}</SidebarContext.Provider>;
}

import { createContext, useContext } from 'react';
type SidebarContextValue = { isOpen: boolean; toggle: () => void; setOpen: (open: boolean) => void };
const SidebarContext = createContext<SidebarContextValue | null>(null);
export function useSidebar() {
  const value = useContext(SidebarContext);
  if (!value) throw new Error('useSidebar debe usarse dentro de SidebarProvider.');
  return value;
}
