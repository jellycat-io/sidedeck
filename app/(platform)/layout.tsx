import chalk from 'chalk';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LibraryProvider } from '@/contexts/library-context';
import { ApiCard } from '@/types/cards';

import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';

let cachedCards: ApiCard[] = [];

async function loadCards(): Promise<ApiCard[]> {
  try {
    if (cachedCards.length > 0) {
      console.log(chalk.blue(`Using cached cards data...`));
      return cachedCards;
    }

    console.log(chalk.blue(`Loading cards data...`));
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/cards.json`);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch cards data: ${res.status} ${res.statusText}`,
      );
    }

    const apiCards = await res.json();
    console.log(chalk.green('Cards data loaded.'));

    if (!Array.isArray(apiCards)) {
      throw new Error('Invalid cards data: Expected an array');
    }

    console.log(chalk.blue('Caching cards data...'));
    cachedCards = apiCards;
    console.log(chalk.green('Cards data cached.'));

    return cachedCards;
  } catch (error) {
    console.error(
      chalk.red(
        `Error loading cards data: ${error instanceof Error ? error.message : error}`,
      ),
    );
    throw error;
  }
}

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export default async function PlatformLayout({
  children,
}: PlatformLayoutProps) {
  const cards = await loadCards();

  return (
    <TooltipProvider>
      <LibraryProvider>
        <Navbar cards={cards} />
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
