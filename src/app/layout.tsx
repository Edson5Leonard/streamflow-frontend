// src/app/layout.tsx
import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AppProviders } from '@/contexts/AppProviders';
import { MocksWarning } from '@/components/feedback/MocksWarning';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'SaaS Streaming - Gestión de Ventas',
  description: 'Plataforma multi-tenant para revendedores y streaming',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${jakarta.className} bg-zinc-50 text-zinc-950 antialiased selection:bg-blue-600 selection:text-white dark:bg-gray-950 dark:text-gray-100`}>
        <MocksWarning />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
