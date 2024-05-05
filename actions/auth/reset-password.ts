'use server';

import * as bcrypt from 'bcryptjs';
import * as z from 'zod';

import { getPasswordResetTokenByToken } from '@/data/token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { ResetPasswordSchema } from '@/schemas/auth';

export async function resetPassword(
  token: string,
  values: z.infer<typeof ResetPasswordSchema>,
) {
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: 'Invalid token.' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired.' };
  }

  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' };
  }

  const user = await getUserByEmail(existingToken.email);

  if (!user) {
    return { error: 'User not found.' };
  }

  const hashedPassword = await bcrypt.hash(values.password, 10);

  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return {
    success:
      'Your password has been updated successfully. You can now log in with your new password.',
  };
}
