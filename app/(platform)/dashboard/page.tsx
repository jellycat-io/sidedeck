'use client';

import { useSession } from 'next-auth/react';

import { Skeleton } from '@/components/ui/skeleton';

import { LastCardsPanel } from './_components/last-cards-panel';

export default function DashboardPage() {
  const session = useSession();

  if (!session.data) {
    return <Skeleton className='h-8' />;
  }

  return (
    <div className='space-y-8'>
      <h1 className='text-2xl'>Hello {session.data.user.name}</h1>
      <div className='grid lg:grid-cols-2 2xl:grid-cols-3'>
        <LastCardsPanel />
      </div>
    </div>
  );
}
