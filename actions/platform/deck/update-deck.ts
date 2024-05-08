'use server';

import { z } from 'zod';

import { updateDeck } from '@/data/deck';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { UpdateDeckSchema } from '@/schemas/deck';

export type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;
export type UpdateDeckResponse = ActionState<
  UpdateDeckInput,
  {
    deckId: string;
    success: string;
  }
>;

async function handler({
  deckId,
  values,
}: UpdateDeckInput): Promise<UpdateDeckResponse> {
  if (!deckId) {
    return {
      error: 'Deck ID is required',
    };
  }

  const deck = await updateDeck(deckId, values);

  if (!deck) {
    return {
      error: `Failed to update deck <${deckId}>`,
    };
  }

  return {
    data: {
      deckId: deck.id,
      success: `Deck ${deck.title} updated successfully`,
    },
  };
}

export const updateDeckAction = createSafeAction(UpdateDeckSchema, handler);
