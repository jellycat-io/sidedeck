'use server';

import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

import { getUserCard } from '@/data/card';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { AddLibraryCardSchema } from '@/schemas/card';

export type AddLibraryCardInput = z.infer<typeof AddLibraryCardSchema>;
export type AddLibraryCardResponse = { success: string };

async function handler({
  card,
  userId,
  issue,
}: AddLibraryCardInput): Promise<
  ActionState<AddLibraryCardInput, AddLibraryCardResponse>
> {
  const existingCard = await getUserCard(userId, card.id);

  let res;

  if (existingCard) {
    // Check if there's an existing issue with the same language, rarity, and set code
    const existingIssue = existingCard.issues.find(
      (i) =>
        i.language === issue.language &&
        i.rarity === issue.rarity &&
        i.set.setCode === issue.set.setCode,
    );

    if (existingIssue) {
      // Increment the quantity of the existing issue by 1
      const updatedIssues = existingCard.issues.map((i) =>
        i.id === existingIssue.id
          ? {
              ...i,
              quantity: i.quantity + issue.quantity,
              updatedAt: new Date().toISOString(),
            }
          : i,
      );

      res = await db.userCard.update({
        where: {
          id: existingCard.id,
        },
        data: {
          issues: {
            set: updatedIssues,
          },
        },
      });
    } else {
      // Add a new issue to the existing card
      res = await db.userCard.update({
        where: {
          id: existingCard.id,
        },
        data: {
          issues: {
            push: {
              id: createId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...issue,
            },
          },
        },
      });
    }
  } else {
    // Create a new entry for the card in the library
    res = await db.userCard.create({
      data: {
        cardId: card.id,
        userId,
        issues: [
          {
            ...issue,
            id: createId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    });
  }

  if (!res) {
    return { error: `Error adding card <${card.id}> to library` };
  }

  return { data: { success: `${card.name} added successfully` } };
}

export const addLibraryCardAction = createSafeAction(
  AddLibraryCardSchema,
  handler,
);
