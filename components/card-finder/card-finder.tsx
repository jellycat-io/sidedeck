/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { getCardsAction } from '@/actions/platform/get-cards';
import { CardSheet } from '@/components/card-finder/card-sheet';
import { FrameTypeBadge } from '@/components/frame-type-badge';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import { ApiCard } from '@/types/cards';

const PAGE_SIZE = 20;

export function CardFinder() {
  const [openFinder, setOpenFinder] = useState(false);
  const [openCardSheet, setOpenCardSheet] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ApiCard | null>(null);
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [totalQueryCount, setTotalQueryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'z' && (event.metaKey || event.ctrlKey)) {
        setOpenFinder(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => {
      document.removeEventListener('keydown', down);
    };
  }, [openFinder]);

  const fetchCards = useCallback(
    async (pageNum: number, isInitial = false) => {
      setLoading(true);
      try {
        const { cards: fetchedCards, totalCount } = await getCardsAction({
          page: pageNum,
          pageSize: PAGE_SIZE,
          query: debouncedQuery,
        });
        setTotalQueryCount(totalCount);
        setCards((prev) =>
          isInitial ? fetchedCards : [...prev, ...fetchedCards],
        );
        setHasMore(totalCount > (pageNum + 1) * PAGE_SIZE);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedQuery],
  );

  // Effect for initial fetch or on query change
  useEffect(() => {
    setPage(0);
    fetchCards(0, true);
  }, [debouncedQuery]);

  // Effect for loading more items
  useEffect(() => {
    if (page > 0) {
      fetchCards(page);
    }
  }, [page]);

  function handleSearchChange(value: string) {
    setQuery(value);
  }

  function handleOpenChange(isOpen: boolean) {
    setOpenFinder(isOpen);
    setQuery('');
  }

  return (
    <>
      <Button variant='outline' size='sm' onClick={() => setOpenFinder(true)}>
        Card finder
        <kbd className='ml-2 inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium'>
          <span className='text-xs'>⌘</span>Z
        </kbd>
      </Button>
      <CommandDialog open={openFinder} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder='Type a card name...'
          value={query}
          onValueChange={handleSearchChange}
        />
        <CommandList className='h-64'>
          {!totalQueryCount && !loading && (
            <CommandEmpty>No results found</CommandEmpty>
          )}
          <CommandGroup>
            {cards.map((card) => (
              <CommandItem
                key={card.id}
                value={card.name}
                onSelect={() => {
                  setSelectedCard(card);
                  setOpenCardSheet(true);
                }}
                className='flex items-center justify-between'
              >
                <span>{card.name}</span>
                <FrameTypeBadge card={card} />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <CommandSeparator />
        <div className='border-t'>
          <div className='text-center text-sm text-muted-foreground py-2'>{`Showing ${cards.length} of ${totalQueryCount} results`}</div>
          {loading ? (
            <div className='h-[40px] flex justify-center items-center'>
              <LoaderCircle className='mr-2 w-4 h-4 animate-spin' />
            </div>
          ) : (
            <Button
              variant='ghost'
              className='w-full hover:-translate-y-0 rounded-none'
              onClick={() => setPage(page + 1)}
              disabled={!hasMore}
            >
              Load more
            </Button>
          )}
        </div>
      </CommandDialog>
      {selectedCard && (
        <CardSheet
          card={selectedCard}
          open={openCardSheet}
          onOpenChange={setOpenCardSheet}
          onRedirect={() => handleOpenChange(false)}
        />
      )}
    </>
  );
}
