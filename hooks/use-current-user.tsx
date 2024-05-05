'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useCurrentUserId(): string | undefined {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const session = useSession();

  useEffect(() => {
    if (session.data?.user) {
      setUserId(session.data?.user.id);
    }
  }, [session.data?.user]);

  return userId;
}
