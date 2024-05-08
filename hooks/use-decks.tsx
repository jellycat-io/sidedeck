import { useContext } from 'react';

import { DeckContext } from '@/contexts/deck-context';

export function useDecks() {
  const deckContext = useContext(DeckContext);

  if (!deckContext) {
    throw new Error('useDecks must be used within a DeckProvider');
  }

  return deckContext;
}
