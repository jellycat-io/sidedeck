'use server';

import { z } from 'zod';

import { getUserCardById } from '@/data/card';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { UpdateIssuesStatusSchema } from '@/schemas/card';

export type UpdateIssueStatusInput = z.infer<typeof UpdateIssuesStatusSchema>;
export type UpdateIssueStatusResponse = ActionState<
  UpdateIssueStatusInput,
  { success: string }
>;

async function handler({
  cardId,
  issueIds,
  status,
}: UpdateIssueStatusInput): Promise<UpdateIssueStatusResponse> {
  const card = await getUserCardById(cardId);

  if (!card) {
    return { error: `Error getting card: <${cardId}>` };
  }

  const issues = card?.issues.filter((i) => issueIds.includes(i.id));

  const updatedIssues = issues.map((issue) => ({
    ...issue,
    tradeable: status,
    updatedAt: new Date().toISOString(),
  }));

  try {
    await db.userCard.update({
      where: {
        id: card.id,
      },
      data: {
        issues: {
          // sort by created at desc
          set: [
            ...card.issues.filter((i) => !issueIds.includes(i.id)),
            ...updatedIssues,
          ].sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0,
          ),
        },
      },
    });

    return { data: { success: 'Issue status updated' } };
  } catch (error: any) {
    return { error: error instanceof Error ? error.message : error };
  }
}

export const updateIssuesStatusAction = createSafeAction(
  UpdateIssuesStatusSchema,
  handler,
);
