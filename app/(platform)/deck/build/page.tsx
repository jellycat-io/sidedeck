'use client';

import { useCurrentUserId } from '@/hooks/use-current-user';

import { BuildDeckForm } from '../_components/build-deck-form';

export default function CreateDeckPage() {
  const userId = useCurrentUserId();

  if (!userId) {
    return null;
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-semibold'>Build a new deck</h1>
      <BuildDeckForm userId={userId} />
    </div>
  );
}
