'use server';

import { z } from 'zod';

import { getCards } from '@/data/card';
import { GetCardsSchema } from '@/schemas/card';
import { Card } from '@/types/cards';

export type GetCardsInput = z.infer<typeof GetCardsSchema>;
export type GetCardsResponse = {
  totalCount: number;
  cards: Card[];
};

export async function getCardsAction({
  page = 0,
  pageSize = 20,
  query = '',
}: GetCardsInput): Promise<GetCardsResponse> {
  let cards = await getCards();

  if (query) {
    cards = cards.filter((card) =>
      card.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const offset = page * pageSize;

  return {
    totalCount: cards.length,
    cards: cards.slice(offset, offset + pageSize),
  };
}
