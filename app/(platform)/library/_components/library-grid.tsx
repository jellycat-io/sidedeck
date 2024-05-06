'use client';

import {
  ChevronsLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';

import { CardImage } from '@/components/card-image';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LibraryCard } from '@/types/cards';

interface LibraryGridProps {
  cards: LibraryCard[];
  onCardClick: (card: LibraryCard) => void;
}

export function LibraryGrid({ cards, onCardClick }: LibraryGridProps) {
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(10);
  const offset = page * cardsPerPage;
  const paginatedCards = cards.slice(offset, offset + cardsPerPage);

  function handleNextPage() {
    setPage(page + 1);
  }

  function handlePreviousPage() {
    setPage(page - 1);
  }

  function handleFirstPage() {
    setPage(0);
  }

  function handleLastPage() {
    setPage(Math.ceil(cards.length / cardsPerPage) - 1);
  }

  function canGetPreviousPage() {
    return page > 0;
  }

  function canGetNextPage() {
    return page < Math.ceil(cards.length / cardsPerPage) - 1;
  }

  return (
    <>
      {!!cards.length && (
        <div
          className='grid grid-cols-5 gap-x-2 gap-y-3'
          suppressHydrationWarning
        >
          {paginatedCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onCardClick(card)}
              className='bg-emerald-400 hover:opacity-80 cursor-pointer contents'
            >
              <CardImage src={card.imageUrl} alt={card.name} size='sm' />
            </div>
          ))}
        </div>
      )}
      <div className='flex items-center justify-between'>
        <div className='flex-1 text-sm text-muted-foreground'>
          Showing {paginatedCards.length} of {cards.length} card(s).
        </div>
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Rows per page</p>
            <Select
              value={`${cardsPerPage}`}
              onValueChange={(value) => {
                setCardsPerPage(Number(value));
              }}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={cardsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent side='top'>
                {[10, 20, 30, 40, 50]
                  .filter(Boolean)
                  .sort((a, b) => a! - b!)
                  .map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            Page {page + 1} of {Math.ceil(cards.length / cardsPerPage)}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => handleFirstPage()}
              disabled={!canGetPreviousPage()}
            >
              <span className='sr-only'>Go to first page</span>
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => handlePreviousPage()}
              disabled={!canGetPreviousPage()}
            >
              <span className='sr-only'>Go to previous page</span>
              <ChevronLeftIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => handleNextPage()}
              disabled={!canGetNextPage()}
            >
              <span className='sr-only'>Go to next page</span>
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => handleLastPage()}
              disabled={!canGetNextPage()}
            >
              <span className='sr-only'>Go to last page</span>
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
