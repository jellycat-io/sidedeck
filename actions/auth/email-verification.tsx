'use server';

import { z } from 'zod';

import { getVerificationTokenByToken } from '@/data/token';
import { getUserByEmail } from '@/data/user';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { VerifyEmailSchema } from '@/schemas/auth';

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type VerifyEmailResponse = { success: string };

export async function handler(
  token: VerifyEmailInput,
): Promise<ActionState<VerifyEmailInput, VerifyEmailResponse>> {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: 'Invalid token.' };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: 'Token has expired.' };

  const user = await getUserByEmail(existingToken.email);

  if (!user) return { error: 'User not found.' };

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return {
    data: {
      success:
        'Thank you for confirming your email! You can now log in to your account.',
    },
  };
}

export const verifyEmailAction = createSafeAction(VerifyEmailSchema, handler);
