'use server';

import { getCards } from '@/data/card';
import { FetchState } from '@/lib/create-safe-fetch';
import { ApiCard } from '@/types/cards';

export type GetCardsResponse = FetchState<ApiCard[]>;

export async function getCardsAction(): Promise<GetCardsResponse> {
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
