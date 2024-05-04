'use client';

import { useSession } from 'next-auth/react';

export function useCurrentUserId() {
  const session = useSession();

  if (!session.data?.user.id) {
    throw new Error('Unauthorized');
  }

  return session.data.user.id;
}
