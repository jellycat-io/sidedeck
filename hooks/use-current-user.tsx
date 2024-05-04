'use client';

import { useSession } from 'next-auth/react';

export function useCurrentUserId(): string | undefined {
  const session = useSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session.data?.user.id;
}
