'use client';

import { useMemo } from 'react';

import { useCurrentUserId } from '@/hooks/use-current-user';
import { useDecks } from '@/hooks/use-decks';

import { BuildDeckForm } from '../../_components/build-deck-form';

interface EditDeckPageProps {
  params: {
    id: string;
  };
}

export default function EditDeckPage({ params }: EditDeckPageProps) {
  const { id } = params;
  const userId = useCurrentUserId();

  const { getDeck } = useDecks();

  const deck = useMemo(() => getDeck(id), [id, getDeck]);

  if (!deck || !userId) {
    return null;
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-semibold'>{`Edit ${deck?.title}`}</h1>
      <BuildDeckForm userId={userId} deck={deck} />
    </div>
  );
}
