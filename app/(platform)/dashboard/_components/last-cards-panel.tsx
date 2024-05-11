'use client';

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
import { LibraryCard } from '@/types/card';

import { DashboardPanel } from './dashboard-panel';

export function LastCardsPanel() {
  const [cards, setCards] = useState<LibraryCard[]>([]);
  const { cards: libraryCards, getLastCards } = useLibrary();

  useEffect(() => {
    setCards(getLastCards());
  }, [libraryCards, getLastCards]);

  if (!cards?.length) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.length ? (
            <>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className='max-w-48 lg:max-w-32 truncate'>
                    {card.name}
                  </TableCell>
                  <TableCell className=' hidden xl:block'>
                    <FrameTypeBadge card={card} withLabel />
                  </TableCell>
                  <TableCell className='text-center'>{card.quantity}</TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={4} className='text-center'>
                No cards found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DashboardPanel>
  );
}
