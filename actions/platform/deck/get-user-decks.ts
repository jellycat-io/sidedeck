'use server';

import { z } from 'zod';

import { getUserDecks } from '@/data/deck';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { DecksSchema, GetUserDecksSchema } from '@/schemas/deck';
import { Deck } from '@/types/deck';

export type GetUserDecksInput = z.infer<typeof GetUserDecksSchema>;
export type GetUserDecksResponse = FetchState<Deck[]>;

async function handler({
  userId,
}: GetUserDecksInput): Promise<GetUserDecksResponse> {
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const decks = await getUserDecks(userId);
  if (!decks) {
    return { error: `Failed to retrieve decks for user <${userId}>` };
  }

  const validated = DecksSchema.safeParse(decks);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  return { data: validated.data };
}

export const getUserDecksAction = createSafeFetch(handler);
