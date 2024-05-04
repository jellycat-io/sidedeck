'use server';

import { z } from 'zod';

import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { RemoveLibraryCardsSchema } from '@/schemas/card';

export type RemoveLibraryCardsInput = z.infer<typeof RemoveLibraryCardsSchema>;
export type RemoveLibraryCardsResponse = { success: string };

async function handler({
  cardIds,
  userId,
}: RemoveLibraryCardsInput): Promise<
  ActionState<RemoveLibraryCardsInput, RemoveLibraryCardsResponse>
> {
  const res = await db.userCard.deleteMany({
    where: {
      userId,
      id: {
        in: cardIds,
      },
    },
  });

  if (!res) {
    return {
      error: `Error removing card ${cardIds.map((id) => `<${id}>`).join(', ')}`,
    };
  }

  return { data: { success: `${res.count} card(s) removed successfully` } };
}

export const removeLibraryCardAction = createSafeAction(
  RemoveLibraryCardsSchema,
  handler,
);
