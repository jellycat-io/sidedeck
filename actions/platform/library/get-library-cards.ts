'use server';

import { z } from 'zod';

import { getCards, getUserCards, toLibraryCard } from '@/data/card';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { GetLibraryCardsSchema } from '@/schemas/card';
import { LibraryCard } from '@/types/cards';

export type GetLibraryCardsInput = z.infer<typeof GetLibraryCardsSchema>;
export type GetLibraryCardsResponse = FetchState<LibraryCard[]>;

async function handler({
  userId,
  limit,
}: GetLibraryCardsInput): Promise<GetLibraryCardsResponse> {
  try {
    if (!userId) {
      return {
        error: 'Unauthorized',
      };
    }

    const cardsData = await getCards();

    const userCards = await getUserCards(userId, limit);

    if (!userCards) {
      return {
        error: 'No user cards found',
      };
    }

    const libraryCards: LibraryCard[] = cardsData
      .filter((card) =>
        userCards.some((userCard) => userCard.cardId === card.id),
      )
      .map((card) => {
        const userCard = userCards.find(
          (userCard) => userCard.cardId === card.id,
        );
        if (!userCard) throw new Error('User card not found');

        const libraryCard = toLibraryCard(card, userCard);

        if (!libraryCard) throw new Error('Library card not found');

        return libraryCard;
      });

    // Sort by updatedAt desc
    return {
      data: libraryCards.sort((a, b) =>
        a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0,
      ),
    };
  } catch (error: any) {
    return {
      error: error instanceof Error ? error.message : error,
    };
  }
}

export const getLibraryCardsAction = createSafeFetch(handler);
