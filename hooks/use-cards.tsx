import { useContext } from 'react';

import { CardContext } from '@/contexts/card-context';

export function useCards() {
  const cardContext = useContext(CardContext);

  if (!cardContext) {
    throw new Error('useCards must be used within a CardProvider');
  }

  return cardContext;
}
