'use server';

import { z } from 'zod';

import { getCardNameById } from '@/data/card';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { UpdateLibraryCardSchema } from '@/schemas/card';

export type UpdateLibraryCardInput = z.infer<typeof UpdateLibraryCardSchema>;
export type UpdateLibraryCardResponse = { success: string };

async function handler({
  cardId,
  userId,
  quantity,
  tradeable,
}: UpdateLibraryCardInput): Promise<
  ActionState<UpdateLibraryCardInput, UpdateLibraryCardResponse>
> {
  const res = await db.userCard.updateMany({
    where: {
      userId,
      cardId,
    },
    data: {
      quantity,
      tradeable,
    },
  });

  if (!res) {
    return { error: `Error updating card <${cardId}>` };
  }

  const cardName = await getCardNameById(cardId);

  if (!cardName) {
    return { error: `Error getting card name by id: ${cardId}` };
  }

  return { data: { success: `${cardName} updated successfully` } };
}

export const updateLibraryCardAction = createSafeAction(
  UpdateLibraryCardSchema,
  handler,
);
