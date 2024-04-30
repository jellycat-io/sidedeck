'use server';

import { z } from 'zod';

import { getCards, getLastUserCards } from '@/data/card';
import { FetchState, createSafeFetch } from '@/lib/create-safe-fetch';
import { GetLastUserCardSchema } from '@/schemas/card';
import { LibraryCardSummary } from '@/types/cards';

export type GetLastUserCardsInput = z.infer<typeof GetLastUserCardSchema>;
export type GetLastUserCardsResponse = FetchState<LibraryCardSummary[]>;

async function handler({
  userId,
}: GetLastUserCardsInput): Promise<GetLastUserCardsResponse> {
  try {
    const cardData = await getCards();

    const userCards = await getLastUserCards(userId);

    if (!userCards) {
      return {
        error: 'No user cards found',
      };
    }

    const libraryCards: LibraryCardSummary[] = cardData
      .filter((card) =>
        userCards.some((userCard) => userCard.cardId === card.id),
      )
      .map((card) => {
        const userCard = userCards.find(
          (userCard) => userCard.cardId === card.id,
        );
        return {
          id: card.id,
          name: card.name,
          slug: card.slug,
          type: card.type,
          frameType: card.frameType,
          quantity: userCard ? userCard.quantity : 0,
          tradeable: userCard ? userCard.tradeable : false,
        };
      });

    return {
      data: libraryCards,
    };
  } catch (error: any) {
    return {
      error: error instanceof Error ? error.message : error,
    };
  }
}

export const getLastUserCardsAction = createSafeFetch(handler);
