import { DeckList } from '@prisma/client';
import { z } from 'zod';

import { db } from '@/lib/db';
import { DeckInputSchema } from '@/schemas/deck';

export async function getDecks() {
  try {
    return await db.deck.findMany();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserDecks(userId: string) {
  try {
    const decks = await db.deck.findMany({
      where: {
        userId,
      },
    });

    return decks;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getDeck(deckId: string) {
  try {
    return await db.deck.findUnique({
      where: {
        id: deckId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserDeck(userId: string, deckId: string) {
  try {
    const deck = await db.deck.findFirst({
      where: {
        id: deckId,
        userId,
      },
    });

    return deck;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createDeck(
  userId: string,
  meta: z.infer<typeof DeckInputSchema>,
  lists: DeckList[],
  valid?: boolean,
) {
  try {
    return await db.deck.create({
      data: {
        userId,
        ...meta,
        lists,
        valid,
      },
    });
  } catch (error) {
    console.error(`Prisma error: ${error}`);
    return null;
  }
}

export async function updateDeck(
  deckId: string,
  meta: z.infer<typeof DeckInputSchema>,
  lists: DeckList[],
  valid?: boolean,
) {
  try {
    return await db.deck.update({
      where: {
        id: deckId,
      },
      data: {
        ...meta,
        lists,
        valid,
      },
    });
  } catch (error) {
    console.error(`Prisma error: ${error}`);
    return null;
  }
}

export async function removeDeck(deckId: string) {
  try {
    return await db.deck.delete({
      where: {
        id: deckId,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
