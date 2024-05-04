import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'Sidedeck',
    template: `%s | Sidedeck`,
  },
  description:
    'SideDeck helps you build and manage your Yu-Gi-Oh! decks. Explore a comprehensive card library, create and fine-tune decks, and seamlessly export them. Perfect your game strategy with SideDeck.',
  generator: 'Next.js',
  keywords: ['Yu-Gi-Oh!', 'deck builder', 'card library', 'game strategy'],
  applicationName: 'SideDeck',
  authors: [
    {
      name: 'SideDeck',
      url: 'https://sidedeck.app',
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn('antialiased', GeistSans.className)}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
