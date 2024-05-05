'use server';

import { getCards } from '@/data/card';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { ApiCard } from '@/types/cards';

export type GetCardsResponse = FetchState<ApiCard[]>;

async function handler(): Promise<GetCardsResponse> {

  let cards = await getCards();

  if (!cards) {
    return {
      error: 'No cards found',
    };
  }

  return {
    data: cards,
  };
}

export const getCardsAction = createSafeFetch(handler);
