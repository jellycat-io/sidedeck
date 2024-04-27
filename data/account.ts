import { Account } from '@prisma/client';

import { db } from '@/lib/db';

export async function getAccountByUserId(
  userId: string,
): Promise<Account | null> {
  try {
    return await db.account.findFirst({
      where: {
        userId,
      },
    });
  } catch (e) {
    throw new Error(`Error getting account by user id: ${userId}`);
  }
}
