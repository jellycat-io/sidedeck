'use server';

import { z } from 'zod';

import { removeDeck } from '@/data/deck';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { RemoveDeckSchema } from '@/schemas/deck';

export type RemoveDeckInput = z.infer<typeof RemoveDeckSchema>;
export type RemoveDeckResponse = ActionState<
  RemoveDeckInput,
  {
    success: string;
  }
>;

async function handler({
  deckId,
}: RemoveDeckInput): Promise<RemoveDeckResponse> {
  if (!deckId) {
    return {
      error: 'Deck ID is required',
    };
  }

  const deck = await removeDeck(deckId);

  if (!deck) {
    return {
      error: 'Failed to remove deck',
    };
  }

  return {
    data: {
      success: `Deck ${deck.title} removed successfully`,
    },
  };
}

export const removeDeckAction = createSafeAction(RemoveDeckSchema, handler);
