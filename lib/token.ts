import { VerificationToken } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import {
  getPasswordResetTokenByEmail,
  getVerificationTokenByEmail,
} from '@/data/token';

import { db } from './db';

export async function generateVerificationToken(
  email: string,
): Promise<VerificationToken> {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  return await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}

export async function generatePasswordResetToken(email: string) {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
}
