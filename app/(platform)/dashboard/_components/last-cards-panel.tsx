import { BadgeEuro } from 'lucide-react';
import { useEffect, useState } from 'react';

import { FrameTypeBadge } from '@/components/frame-type-badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLibrary } from '@/hooks/use-library';
import { LibraryCard } from '@/types/cards';

import { DashboardPanel } from './dashboard-panel';

export function LastCardsPanel() {
  const [cards, setCards] = useState<LibraryCard[]>([]);
  const { cards: libraryCards, loading, getLastCards } = useLibrary();

  useEffect(() => {
    setCards(getLastCards());
  }, [libraryCards, getLastCards]);

  if (!cards?.length || loading) {
    return <Skeleton className='h-[260px]' />;
  }

  return (
    <DashboardPanel
      title='Last Library updates'
      link='/library'
      linkLabel='Browse library'
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className='hidden xl:table-cell'>Type</TableHead>
            <TableHead className='text-center '>Quantity</TableHead>
            <TableHead className='text-center'>Tradeable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => (
            <TableRow key={card.id}>
              <TableCell className='max-w-48 lg:max-w-32 truncate'>
                {card.name}
              </TableCell>
              <TableCell className=' hidden xl:block'>
                <FrameTypeBadge card={card} />
              </TableCell>
              <TableCell className='text-center'>{card.quantity}</TableCell>
              <TableCell className='flex justify-center'>
                {card.tradeable && (
                  <BadgeEuro className='h-5 w-5 text-emerald-400' />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardPanel>
  );
}
