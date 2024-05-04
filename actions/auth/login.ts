'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/token';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas/auth';

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) {
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) return { error: 'Invalid credentials.' };

  const { email, password } = validated.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'User not found.' };
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) return { error: 'Invalid credentials.' };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      existingUser.name,
      verificationToken.email,
      verificationToken.token,
    );

    return {
      success:
        'Account not verified. Please check your email for the verification link.',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.' };
        default:
          return { error: 'An error occurred.' };
      }
    }

    throw error;
  }
}
