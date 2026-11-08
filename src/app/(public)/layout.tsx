import type { ReactNode } from 'react';
import { PublicHeader } from './components/PublicHeader';
import { PublicFooter } from './components/PublicFooter';
import './components/public-navigation.css';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div id="public-top" className="flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip bg-[#fbfbfe] text-foreground dark:bg-[#0b0d17]">
    <PublicHeader />
    <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 pb-6 pt-5 sm:px-8 sm:pt-7">{children}</main>
    <PublicFooter />
  </div>;
}
