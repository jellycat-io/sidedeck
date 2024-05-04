'use client';

import { useEffect, useState } from 'react';

import { CardImage } from '@/components/card-image';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useLibrary } from '@/hooks/use-library';

import { LibraryCardIssuesTable } from './library-card-issues-table';

interface LibraryCardSheetProps {
  cardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LibraryCardSheet({
  cardId,
  open,
  onOpenChange,
}: LibraryCardSheetProps) {
  const [mounted, setMounted] = useState(false);

  const { getLibraryCard } = useLibrary();

  const card = getLibraryCard(cardId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!card) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side='bottom' className='flex gap-6 min-h-[460px]'>
        <div className='hidden lg:block shrink-0'>
          <CardImage src={card.imageUrl} alt={card.name} width={250} />
        </div>
        <div className='flex flex-col gap-y-2 overflow-auto'>
          <div className='flex items-center space-x-2'>
            <h3 className='text-xl font-semibold'>{card.name}</h3>
            <p className='text-sm text-muted-foreground'>
              {`ID: ${card.cardId}`}
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <p>Total</p>
              <Badge
                variant='outline'
                className='min-w-8 flex items-center justify-center'
              >
                {card.quantity}
              </Badge>
            </div>
            <div className='flex items-center space-x-2'>
              <p>Issues</p>
              <Badge
                variant='outline'
                className='min-w-8 flex items-center justify-center'
              >
                {card.issues.length}
              </Badge>
            </div>
          </div>
          <LibraryCardIssuesTable cardId={card.id} issues={card.issues} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
