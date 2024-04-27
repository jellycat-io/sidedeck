import { VerificationToken } from '@prisma/client';

import { db } from '@/lib/db';

export async function getVerificationTokenByEmail(
  email: string,
): Promise<VerificationToken | null> {
  try {
    return await db.verificationToken.findFirst({
      where: {
        email,
      },
    });
  } catch (e) {
    throw new Error(`Error getting verification token by email: ${email}`);
  }
}

export async function getVerificationTokenByToken(
  token: string,
): Promise<VerificationToken | null> {
  try {
    return await db.verificationToken.findUnique({
      where: {
        token: token,
      },
    });
  } catch (e) {
    console.error('Error getting verification token by token', e);
    return null;
  }
}

export function getPasswordResetTokenByToken(token: string) {
  try {
    return db.passwordResetToken.findUnique({
      where: { token },
    });
  } catch {
    return null;
  }
}

export function getPasswordResetTokenByEmail(email: string) {
  try {
    return db.passwordResetToken.findFirst({
      where: { email },
    });
  } catch {
    return null;
  }
}
