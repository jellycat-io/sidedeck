'use client';

import { useSession } from 'next-auth/react';

import { LastCardsPanel } from './_components/last-cards-panel';

export default function DashboardPage() {
  const session = useSession();

  if (!session.data?.user.id) {
    return null;
  }

  return (
    <div className='space-y-12'>
      <h1 className='text-2xl'>Hello {session.data.user.name}</h1>
      <div className='grid lg:grid-cols-2 2xl:grid-cols-3'>
        <LastCardsPanel userId={session.data.user.id} />
      </div>
    </div>
  );
}
