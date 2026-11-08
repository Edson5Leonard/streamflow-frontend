'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { SidebarProvider } from './SidebarProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <SidebarProvider>
            {children}
            <Toaster richColors closeButton />
          </SidebarProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
