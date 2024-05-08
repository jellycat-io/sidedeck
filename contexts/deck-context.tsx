'use client';

import { createContext, useCallback, useEffect, useState } from 'react';

import { getUserDecksAction } from '@/actions/platform/deck/get-user-decks';
import { useCurrentUserId } from '@/hooks/use-current-user';
import { useFetch } from '@/hooks/use-fetch';
import { Deck } from '@/types/deck';

interface DeckContextValue {
  decks: Deck[];
  loading: boolean;
  refreshDecks: () => void;
  getDeck: (id: string) => Deck | undefined;
}

export const DeckContext = createContext<DeckContextValue>({
  decks: [],
  loading: false,
  refreshDecks: () => {},
  getDeck: () => undefined,
});

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const userId = useCurrentUserId();
  const [userDecks, setUserDecks] = useState<Deck[]>([]);

  const {
    data: decks,
    loading,
    refresh,
  } = useFetch(getUserDecksAction, {
    userId,
  });

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (decks) {
      setUserDecks(decks);
    }
  }, [decks]);

  const getDeck = useCallback(
    (id: string) => userDecks.find((deck) => deck.id === id),
    [userDecks],
  );

  return (
    <DeckContext.Provider
      value={{
        decks: userDecks,
        loading,
        refreshDecks: refresh,
        getDeck,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
}
