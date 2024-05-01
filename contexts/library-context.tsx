'use client';

import { createContext, useEffect, useState } from 'react';

import { getLibraryCardsAction } from '@/actions/platform/library/get-library-cards';
import { useCurrentUserId } from '@/hooks/use-current-user';
import { useFetch } from '@/hooks/use-fetch';
import { LibraryCard } from '@/types/cards';

interface LibraryContextValue {
  cards: LibraryCard[];
  loading: boolean;
  refreshLibrary: () => void;
  getLastCards: () => LibraryCard[];
}

export const LibraryContext = createContext<LibraryContextValue>({
  cards: [],
  loading: false,
  refreshLibrary: () => {},
  getLastCards: () => [],
});

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const userId = useCurrentUserId();
  const [cards, setCards] = useState<LibraryCard[]>([]);

  const {
    data: libraryCards,
    loading,
    refresh,
  } = useFetch(getLibraryCardsAction, {
    userId,
  });

  useEffect(() => {
    if (libraryCards) {
      setCards(libraryCards);
    }
  }, [libraryCards]);

  function refreshLibrary() {
    refresh();
  }

  function getLastCards() {
    return cards.slice(0, 5);
  }

  return (
    <LibraryContext.Provider
      value={{ cards, loading, refreshLibrary, getLastCards }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
