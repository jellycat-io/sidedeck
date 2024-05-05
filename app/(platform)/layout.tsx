import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LibraryProvider } from '@/contexts/library-context';
import { loadCards } from '@/data/card';

import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export default async function PlatformLayout({
  children,
}: PlatformLayoutProps) {
  const apiCards = await loadCards();

  return (
    <TooltipProvider>
      <LibraryProvider>
        <Navbar cards={apiCards} />
        <div className='pt-14 md:grid md:grid-cols-[224px_auto] h-screen'>
          <aside className='py-6 px-4 hidden md:block border-r'>
            <Sidebar />
          </aside>
          <main className='px-8 py-6'>{children}</main>
        </div>
        <Toaster />
      </LibraryProvider>
    </TooltipProvider>
  );
}
