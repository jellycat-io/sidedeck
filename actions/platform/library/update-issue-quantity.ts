'use server';

import { z } from 'zod';

import { getUserCardById } from '@/data/card';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { UpdateIssueQuantitySchema } from '@/schemas/card';

export type UpdateIssueQuantityInput = z.infer<
  typeof UpdateIssueQuantitySchema
>;
export type UpdateIssueQuantityResponse = ActionState<
  UpdateIssueQuantityInput,
  { success: string }
>;

async function handler({
  cardId,
  issueId,
  quantity,
}: UpdateIssueQuantityInput): Promise<UpdateIssueQuantityResponse> {
  const card = await getUserCardById(cardId);

  if (!card) {
    return { error: `Error getting card: <${cardId}>` };
  }

  const issue = card?.issues.find((i) => i.id === issueId);
  if (!issue) {
    return { error: `Error getting issue: <${issueId}>` };
  }

  const updatedIssue = {
    ...issue,
    quantity,
    updatedAt: new Date().toISOString(),
  };

  try {
    await db.userCard.update({
      where: {
        id: card.id,
      },
      data: {
        issues: {
          // sort by created at desc
          set: [
            ...card.issues.filter((i) => i.id !== issueId),
            updatedIssue,
          ].sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0,
          ),
        },
      },
    });

    return { data: { success: 'Issue quantity updated' } };
  } catch (error: any) {
    return { error: error instanceof Error ? error.message : error };
  }
}

export const updateIssueQuantityAction = createSafeAction(
  UpdateIssueQuantitySchema,
  handler,
);
