'use client';

import { set } from 'date-fns';
import { LoaderCircle } from 'lucide-react';
import { createContext, useEffect, useState } from 'react';

import { getCardsAction } from '@/actions/platform/get-cards';
import { useFetch } from '@/hooks/use-fetch';
import { Card } from '@/types/cards';

interface CardsContextValue {
  cards: Card[];
  loading: boolean;
  getCard(id: string): Card | undefined;
}

export const CardsContext = createContext<CardsContextValue>({
  cards: [],
  loading: false,
  getCard: () => undefined,
});

interface CardsProviderProps {
  children: React.ReactNode;
}

export function CardsProvider({ children }: CardsProviderProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: cardsData, loading: loadingCards } = useFetch(getCardsAction);

  function getCard(id: string) {
    return cards.find((card) => card.id === id);
  }

  useEffect(() => {
    setLoading(true);
    setCards(cardsData || []);
    setLoading(false);
  }, [cardsData]);

  return (
    <CardsContext.Provider value={{ cards, loading, getCard }}>
      {loadingCards ? (
        <div className='w-full h-full flex items-center justify-center'>
          <LoaderCircle className='w-24 h-24 animate-spin' />
        </div>
      ) : (
        children
      )}
    </CardsContext.Provider>
  );
}
