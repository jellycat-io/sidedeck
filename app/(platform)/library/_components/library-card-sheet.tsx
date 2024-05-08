'use client';

import { useEffect, useState } from 'react';

import { CardImage } from '@/components/card-image';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCards } from '@/hooks/use-cards';
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
  const { getCard } = useLibrary();
  const { toggleFinder } = useCards();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) {
      toggleFinder(true);
    }
  }

  const card = getCard(cardId);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side='bottom'
        className='flex gap-6 min-h-[460px] rounded-t-md'
      >
        {card ? (
          <>
            <div className='hidden lg:block shrink-0'>
              <CardImage
                src={card.imageUrl}
                alt={card.name}
                banStatus={card.banlistInfo?.ban_tcg}
              />
            </div>
            <div className='flex flex-col gap-y-4 overflow-auto pr-2'>
              <div className='space-y-1'>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-xl font-semibold'>{card.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {`ID: ${card.cardId}`}
                  </p>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <p>Total owned</p>
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
              </div>
              <LibraryCardIssuesTable
                cardId={card.id}
                issues={card.issues}
                onRemoveLastIssue={() => handleOpenChange(false)}
              />
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center w-full'>
            <p className='text-muted-foreground'>Card not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
