'use client';

import { createContext, useCallback, useEffect, useState } from 'react';

import { getLibraryCardsAction } from '@/actions/platform/library/get-library-cards';
import { useCurrentUserId } from '@/hooks/use-current-user';
import { useFetch } from '@/hooks/use-fetch';
import { LibraryCard } from '@/types/card';

interface LibraryContextValue {
  cards: LibraryCard[];
  loading: boolean;
  refreshLibrary: () => void;
  getLastCards: () => LibraryCard[];
  getLibraryCard: (id: string) => LibraryCard | undefined;
  getIssueCardId: (issueId: string) => string | undefined;
  checkLibraryCard: (
    id: string,
    targetQuantity: number,
  ) => {
    exists: boolean;
    hasEnough: boolean;
    quantity: number;
  };
  getCard: (id: string) => LibraryCard | undefined;
}

export const LibraryContext = createContext<LibraryContextValue>({
  cards: [],
  loading: false,
  refreshLibrary: () => {},
  getLastCards: () => [],
  getLibraryCard: () => undefined,
  getIssueCardId: () => undefined,
  checkLibraryCard: () => ({
    exists: false,
    hasEnough: false,
    quantity: 0,
  }),
  getCard: () => undefined,
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
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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

  const getLibraryCard = useCallback(
    (id: string) => cards.find((card) => card.id === id),
    [cards],
  );

  const getIssueCardId = useCallback(
    (issueId: string) => {
      const card = cards.find((card) =>
        card.issues.some((issue) => issue.id === issueId),
      );

      return card?.id;
    },
    [cards],
  );

  const getCard = useCallback(
    (id: string) => cards.find((card) => card.id === id),
    [cards],
  );

  const checkLibraryCard = useCallback(
    (id: string, targetQuantity: number) => {
      const card = cards.find((card) => card.cardId === id);

      if (!card) {
        return {
          exists: false,
          hasEnough: false,
          quantity: 0,
        };
      }

      return {
        exists: true,
        hasEnough: card.quantity >= targetQuantity,
        quantity: card.quantity,
      };
    },
    [cards],
  );

  return (
    <LibraryContext.Provider
      value={{
        cards,
        loading,
        refreshLibrary,
        getLastCards,
        getLibraryCard,
        getIssueCardId,
        getCard,
        checkLibraryCard,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
