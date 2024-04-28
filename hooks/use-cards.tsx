'use client';

import { useContext } from 'react';

import { CardsContext } from '@/contexts/cards-context';

export function useCards() {
  return useContext(CardsContext);
}
