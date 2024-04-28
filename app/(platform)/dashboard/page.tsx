'use client';

import { useSession } from 'next-auth/react';

import { CardTooltip } from '@/components/card-tooltip';
import { useCards } from '@/hooks/use-cards';

export default function DashboardPage() {
  const { getCard } = useCards();
  const session = useSession();

  if (!session.data) {
    return null;
  }

  const card = getCard('54490275');

  return (
    <>
      <h2>Hello {session.data.user.name}</h2>
      {card && <CardTooltip id={card.id} />}
    </>
  );
}
