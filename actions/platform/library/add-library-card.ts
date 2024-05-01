'use server';

import { z } from 'zod';

import { getCardNameById } from '@/data/card';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { AddLibraryCardSchema } from '@/schemas/card';

export type AddLibraryCardInput = z.infer<typeof AddLibraryCardSchema>;
export type AddLibraryCardResponse = { success: string };

async function handler({
  cardId,
  userId,
  quantity,
  tradeable,
}: AddLibraryCardInput): Promise<
  ActionState<AddLibraryCardInput, AddLibraryCardResponse>
> {
  const existingCard = await db.userCard.findFirst({
    where: {
      cardId,
    },
  });

  let res;

  if (existingCard) {
    res = await db.userCard.update({
      where: {
        id: existingCard.id,
      },
      data: {
        quantity: existingCard.quantity + 1,
      },
    });
  } else {
    res = await db.userCard.create({
      data: {
        cardId,
        userId,
        quantity: quantity || 1,
        tradeable: tradeable || false,
      },
    });
  }

  if (!res) {
    return { error: `Error adding card <${cardId}> to library` };
  }

  const cardName = await getCardNameById(cardId);

  if (!cardName) {
    return { error: `Error getting card name by id: ${cardId}` };
  }

  return { data: { success: `${cardName} added successfully` } };
}

export const addLibraryCardAction = createSafeAction(
  AddLibraryCardSchema,
  handler,
);
