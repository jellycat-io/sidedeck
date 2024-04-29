'use client';

import { z } from 'zod';

import { getCardById } from '@/data/card';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { GetCardSchema } from '@/schemas/card';
import { Card } from '@/types/cards';

export type GetCardInput = z.infer<typeof GetCardSchema>;
export type GetCardResponse = FetchState<Card>;

async function handler({ cardId }: GetCardInput): Promise<GetCardResponse> {
  const card = await getCardById(cardId);

  if (!card) {
    return { error: 'Card not found' };
  }

  return { data: card };
}

export const getCardAction = createSafeFetch(handler);
