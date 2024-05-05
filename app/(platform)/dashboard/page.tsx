'use client';

import { useCurrentSession } from '@/hooks/use-current-session';

import { LastCardsPanel } from './_components/last-cards-panel';

export default function DashboardPage() {
  const { session } = useCurrentSession();

  return (
    <div className='space-y-8'>
      <h1 className='text-xl font-semibold'>Hello {session?.user.name}</h1>
      <div className='grid lg:grid-cols-2 2xl:grid-cols-3'>
        <LastCardsPanel />
      </div>
    </div>
  );
}
