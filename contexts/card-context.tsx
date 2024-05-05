'use client';

import { createContext, useCallback, useEffect, useState } from 'react';

import { getCardsAction } from '@/actions/platform/get-cards';
import { useFetch } from '@/hooks/use-fetch';
import { ApiCard } from '@/types/cards';

interface CardContextValue {
  cards: ApiCard[];
  loading: boolean;
  getCard: (id: string) => ApiCard | undefined;
  getQueryCards: ({
    query,
    limit,
    page,
  }: {
    query?: string;
    limit: number;
    page: number;
  }) => {
    cards: ApiCard[];
    totalCount: number;
    loading: boolean;
  };
}

export const CardContext = createContext<CardContextValue>({
  cards: [],
  loading: false,
  getCard: () => undefined,
  getQueryCards: () => ({
    cards: [],
    totalCount: 0,
    loading: false,
  }),
});

export function CardProvider({ children }: { children: React.ReactNode }) {
  const { data: apiCards, loading: loadingCards } = useFetch(getCardsAction);

  const [cards, setCards] = useState<ApiCard[]>(apiCards || []);
  const [loading, setLoading] = useState<boolean>(loadingCards);

  useEffect(() => {
    if (apiCards && !loading) {
      setCards(apiCards);
    }
  }, [apiCards, loading]);

  useEffect(() => {
    setLoading(loadingCards);
  }, [loadingCards]);

  const getCard = useCallback(
    (id: string) =>
      !loading ? cards.find((card) => card.id === id) : undefined,
    [cards, loading],
  );

  const getQueryCards = useCallback(
    ({
      query,
      limit,
      page,
    }: {
      query?: string;
      limit: number;
      page: number;
    }) => {
      if (loading || !cards.length) {
        return {
          cards: [],
          totalCount: 0,
          loading: true,
        };
      }

      const queryCards = !!query
        ? cards.filter((card) =>
            card.name.toLowerCase().includes(query.toLowerCase()),
          )
        : cards;

      return {
        cards: queryCards.slice(page * limit, (page + 1) * limit),
        totalCount: queryCards.length,
        loading: false,
      };
    },
    [cards, loading],
  );

  return (
    <CardContext.Provider
      value={{
        cards,
        loading,
        getCard,
        getQueryCards,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}
