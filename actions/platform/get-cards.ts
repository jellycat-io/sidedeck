'use server';

import { getCards } from '@/data/card';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { Card } from '@/types/cards';

export type GetCardsResponse = FetchState<Card[]>;

async function handler(): Promise<GetCardsResponse> {
  const cards = await getCards();

  if (!cards) {
    return { error: 'No cards found' };
  }

  return { data: cards };
}

export const getCardsAction = createSafeFetch(handler);
