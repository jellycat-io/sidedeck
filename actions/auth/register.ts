'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { getUserByEmail } from '@/data/user';
import { ActionState, createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/token';
import { RegisterSchema } from '@/schemas/auth';

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RegisterResponse = { success: string };

async function handler(
  values: RegisterInput,
): Promise<ActionState<RegisterInput, RegisterResponse>> {
  const validated = RegisterSchema.safeParse(values);

  if (!validated.success) return { error: 'Invalid credentials.' };

  const { name, email, password } = validated.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: 'Email already taken.' };

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!user) return { error: 'Failed to create user.' };

  const verificationToken = await generateVerificationToken(email);

  if (!verificationToken) {
    return { error: 'Failed to create verification token.' };
  }

  await sendVerificationEmail(
    name,
    verificationToken.email,
    verificationToken.token,
  );

  return {
    data: {
      success:
        'Account created. Please check your email for the verification link.',
    },
  };
}

export const registerAction = createSafeAction(RegisterSchema, handler);
