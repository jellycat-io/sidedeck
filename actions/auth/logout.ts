'use server';

import { signOut } from '@/auth';
import { Routes } from '@/routes';

export async function logout(callbackUrl: string) {
  await signOut({
    redirectTo: `${Routes.auth.login}?callbackUrl=${callbackUrl}`,
  });
}
