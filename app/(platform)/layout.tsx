import { CardsProvider } from '@/contexts/cards-context';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  return (
    <CardsProvider>
      <main className='h-full p-8'>{children}</main>
    </CardsProvider>
  );
}
