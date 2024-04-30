import { BadgeEuro } from 'lucide-react';

import { getLastUserCardsAction } from '@/actions/platform/dashboard/get-last-user-cards';
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
import { useFetch } from '@/hooks/use-fetch';

import { DashboardPanel } from './dashboard-panel';

interface LastCardsPanelProps {
  userId: string;
}

export function LastCardsPanel({ userId }: LastCardsPanelProps) {
  const { data: cards, loading } = useFetch(getLastUserCardsAction, { userId });

  if (!cards?.length || loading) {
    return <Skeleton className='h-[260px]' />;
  }

  return (
    <DashboardPanel
      title='Last cards added'
      link='/library'
      linkLabel='View all cards'
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
