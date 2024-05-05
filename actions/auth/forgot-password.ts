'use server';

import * as z from 'zod';

import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/token';
import { ForgotPasswordSchema } from '@/schemas/auth';

export async function forgotPassword(
  values: z.infer<typeof ForgotPasswordSchema>,
) {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email.' };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email not found.' };
  }

  const resetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(resetToken.email, resetToken.token);

  return {
    success:
      'Reset link sent! Please check your email to change your password.',
  };
}
