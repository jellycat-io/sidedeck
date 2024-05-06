'use server';

import { z } from 'zod';

import { getUserCardById } from '@/data/card';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { RemoveIssuesSchema } from '@/schemas/card';

export type RemoveIssuesInput = z.infer<typeof RemoveIssuesSchema>;
export type RemoveIssuesResponse = ActionState<
  RemoveIssuesInput,
  { success: string; removed?: boolean }
>;

async function handler({
  cardId,
  issueIds,
}: RemoveIssuesInput): Promise<RemoveIssuesResponse> {
  const card = await getUserCardById(cardId);

  if (!card) {
    return {
      error: `Card not found: <${cardId}>`,
    };
  }

  const updatedIssues = card.issues.filter(
    (issue) => !issueIds.includes(issue?.id),
  );

  if (updatedIssues.length === 0) {
    await db.userCard.delete({
      where: {
        id: card.id,
      },
    });

    return {
      data: { success: 'Card removed successfully', removed: true },
    };
  }

  await db.userCard.update({
    where: {
      id: card.id,
    },
    data: {
      issues: {
        set: updatedIssues,
      },
    },
  });

  return {
    data: { success: 'Issues removed successfully' },
  };
}

export const removeIssuesAction = createSafeAction(RemoveIssuesSchema, handler);
