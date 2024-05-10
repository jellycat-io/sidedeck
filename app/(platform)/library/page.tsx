'use client';

import { LayoutGrid, Table } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/use-cards';
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

  const { cards, loading } = useLibrary();
  const { toggleFinder } = useCards();

  return (
    <div className='px-8 py-6 flex flex-col gap-y-4' suppressHydrationWarning>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold'>Library</h1>
        <div className='flex items-center space-x-4'>
          <p className='text-sm'>View mode</p>
          <div className='flex border rounded-md overflow-hidden'>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'rounded-none h-8 space-x-2',
                viewMode === 'table' &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
              )}
              onClick={() => setViewMode('table')}
            >
              <span>Table</span>
              <Table className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'rounded-none h-8 space-x-2',
                viewMode === 'grid' &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
              )}
              onClick={() => setViewMode('grid')}
            >
              <span>Grid</span>
              <LayoutGrid className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
      {viewMode === 'table' ? (
        <LibraryTable
          data={cards}
          loading={loading}
          onCardClick={(card) => {
            setSelectedCardId(card.id);
            setOpenDetails(true);
            toggleFinder(false);
          }}
        />
      ) : (
        <LibraryGrid
          cards={cards}
          loading={loading}
          onCardClick={(card) => {
            setSelectedCardId(card.id);
            setOpenDetails(true);
            toggleFinder(false);
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
