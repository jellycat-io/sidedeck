'use server';

import { z } from 'zod';

import { getCards, getLibraryCards } from '@/data/card';
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
    const cardData = await getCards();

    const userCards = await getLibraryCards(userId, limit);

    if (!userCards) {
      return {
        error: 'No user cards found',
      };
    }

    const libraryCards: LibraryCard[] = cardData
      .filter((card) =>
        userCards.some((userCard) => userCard.cardId === card.id),
      )
      .map((card) => {
        const userCard = userCards.find(
          (userCard) => userCard.cardId === card.id,
        );
        return {
          ...card,
          createdAt: userCard ? userCard.createdAt : '',
          updatedAt: userCard ? userCard.updatedAt : '',
          quantity: userCard ? userCard.quantity : 0,
          tradeable: userCard ? userCard.tradeable : false,
        };
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
