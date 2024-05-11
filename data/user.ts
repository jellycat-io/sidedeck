import { User } from '@prisma/client';

import { db } from '@/lib/db';

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await db.user.findFirst({
      where: {
        email,
      },
    });
  } catch (e) {
    throw new Error(`Error getting user by email <${email}>: ${e}`);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    });
  } catch (e) {
    throw new Error(`Error getting user by id <${id}>: ${e}`);
  }
}
