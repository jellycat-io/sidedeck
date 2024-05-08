'use server';

import { z } from 'zod';

import { createDeck } from '@/data/deck';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { CreateDeckSchema } from '@/schemas/deck';

export type CreateDeckInput = z.infer<typeof CreateDeckSchema>;
export type CreateDeckResponse = ActionState<
  CreateDeckInput,
  {
    deckId: string;
    success: string;
  }
>;

async function handler({
  userId,
  values,
}: CreateDeckInput): Promise<CreateDeckResponse> {
  if (!userId) {
    return {
      error: 'User ID is required',
    };
  }

  const deck = await createDeck(userId, values);

  if (!deck) {
    return {
      error: 'Failed to create deck',
    };
  }

  return {
    data: {
      deckId: deck.id,
      success: `Deck ${deck.title} created successfully`,
    },
  };
}

export const createDeckAction = createSafeAction(CreateDeckSchema, handler);
