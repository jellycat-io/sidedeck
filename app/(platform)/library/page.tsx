'use client';

import { LayoutGrid, Table } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useLibrary } from '@/hooks/use-library';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

import { LibraryCardSheet } from './_components/library-card-sheet';
import { LibraryGrid } from './_components/library-grid';
import { LibraryTable } from './_components/library-table';

type LibraryViewMode = 'table' | 'grid';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useLocalStorage<LibraryViewMode>(
    'sd-library-view-mode',
    'table',
  );
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const { cards } = useLibrary();

  return (
    <div className='flex flex-col gap-y-4' suppressHydrationWarning>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold'>Library</h1>
        <div className='flex border rounded-md overflow-hidden'>
          <Button
            variant='ghost'
            size='iconSm'
            className={cn(
              'rounded-none hover:-translate-y-0',
              // viewMode === 'table' && 'bg-accent text-accent-foreground',
            )}
            onClick={() => setViewMode('table')}
          >
            <span className='sr-only'>Table view</span>
            <Table className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='iconSm'
            className={cn(
              'rounded-none hover:-translate-y-0',
              // viewMode === 'grid' && 'bg-accent text-accent-foreground',
            )}
            onClick={() => setViewMode('grid')}
          >
            <span className='sr-only'>Grid view</span>
            <LayoutGrid className='h-4 w-4' />
          </Button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <LibraryTable
          data={cards}
          onCardClick={(card) => {
            setSelectedCardId(card.id);
            setOpenDetails(true);
          }}
        />
      ) : (
        <LibraryGrid
          cards={cards}
          onCardClick={(card) => {
            setSelectedCardId(card.id);
            setOpenDetails(true);
          }}
        />
      )}
      {selectedCardId && (
        <LibraryCardSheet
          cardId={selectedCardId}
          open={openDetails}
          onOpenChange={setOpenDetails}
        />
      )}
    </div>
  );
}
