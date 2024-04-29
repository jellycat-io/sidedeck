'use client';

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const session = useSession();

  if (!session.data) {
    return null;
  }

  return (
    <>
      <h2>Dashboard</h2>
    </>
  );
}
