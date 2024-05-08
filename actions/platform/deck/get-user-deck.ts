'use server';

import { z } from 'zod';

import { getUserDeck } from '@/data/deck';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { DeckSchema, GetUserDeckSchema } from '@/schemas/deck';
import { Deck } from '@/types/deck';

export type GetUserDeckInput = z.infer<typeof GetUserDeckSchema>;
export type GetUserDeckResponse = FetchState<Deck>;

async function handler({
  userId,
  deckId,
}: GetUserDeckInput): Promise<GetUserDeckResponse> {
  if (!userId) {
    return { error: 'User ID is required' };
  }

  if (!deckId) {
    return { error: 'Deck ID is required' };
  }

  const deck = await getUserDeck(userId, deckId);
  if (!deck) {
    return {
      error: `Failed to retrieve deck <${deckId}> for user <${userId}>`,
    };
  }

  const validated = DeckSchema.safeParse(deck);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  return { data: validated.data };
}

export const getUserDeckAction = createSafeFetch(handler);
