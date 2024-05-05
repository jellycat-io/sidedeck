'use client';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useCurrentSession() {
  const nextSession = useSession();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (nextSession.data) {
      setSession(nextSession.data);
    }
  }, [nextSession.data]);

  function update() {
    nextSession.update();
  }

  return { session, update };
}
