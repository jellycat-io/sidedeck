import chalk from 'chalk';

import { db } from '@/lib/db';
import {
  LibraryCardSchema,
  UserCardSchema,
  UserCardsSchema,
} from '@/schemas/card';
import { ApiCard, LibraryCard, UserCard } from '@/types/card';

const CARDS_URL = `${process.env.NEXT_PUBLIC_VERCEL_URL?.includes('localhost') ? process.env.NEXT_PUBLIC_VERCEL_URL : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`}/cards.json`;

let cachedCards: ApiCard[] = [];

export async function loadCards(): Promise<ApiCard[]> {
  try {
    if (cachedCards.length > 0) {
      console.log(chalk.blue(`Using cached cards data...`));
      return cachedCards;
    }

    console.log(chalk.blue(`Loading cards data...`));

    const res = await fetch(CARDS_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(chalk.green('Cards data loaded.'));

    console.log(chalk.blue('Caching cards data...'));
    cachedCards = await res.json();

    console.log(chalk.green('Cards data cached.'));

    return cachedCards;
  } catch (error) {
    throw new Error(
      `Error loading cards data: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getCards() {
  try {
    return await loadCards();
  } catch (error) {
    throw new Error(
      `Error getting cards: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getCardById(id: string) {
  try {
    const cards = await loadCards();
    const card = cards.find((card) => card.id === id);
    return card;
  } catch (error) {
    throw new Error(
      `Error getting card by id: ${id}, ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getUserCards(
  userId: string,
  limit?: number,
): Promise<UserCard[] | null> {
  try {
    const cards = await db.userCard.findMany({
      where: {
        userId,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const validated = UserCardsSchema.safeParse(cards);

    if (!validated.success) {
      console.error(
        `Invalid card data: ${JSON.stringify(validated.error.errors)}`,
      );
      return null;
    }

    return validated.data;
  } catch (error) {
    throw new Error(
      `Error getting user cards: ${userId}, ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getUserCard(userId: string, cardId: string) {
  try {
    const card = await db.userCard.findFirst({
      where: {
        userId,
        cardId,
      },
    });

    if (!card) {
      return null;
    }

    const validated = UserCardSchema.safeParse(card);

    if (!validated.success) {
      throw new Error(
        `Invalid card data: ${JSON.stringify(validated.error.errors)}`,
      );
    }

    return validated.data;
  } catch (error) {
    throw new Error(
      `Error getting user card: ${userId}, ${cardId}, ${
        error instanceof Error ? error.message : error
      }`,
    );
  }
}

export async function getUserCardById(id: string) {
  try {
    const card = await db.userCard.findUnique({
      where: {
        id,
      },
    });

    if (!card) {
      return null;
    }

    const validated = UserCardSchema.safeParse(card);

    if (!validated.success) {
      throw new Error(
        `Invalid card data: ${JSON.stringify(validated.error.errors)}`,
      );
    }

    return validated.data;
  } catch (error) {
    throw new Error(
      `Error getting user card by id: ${id}, ${
        error instanceof Error ? error.message : error
      }`,
    );
  }
}

export async function getUserCardIssueById(id: string) {
  try {
    const issue = await db.userCard.findFirst({
      where: {
        issues: {
          has: {
            id,
          },
        },
      },
    });

    if (!issue) {
      return null;
    }

    return issue;
  } catch (error) {
    throw new Error(
      `Error getting user card issue by id: ${id}, ${
        error instanceof Error ? error.message : error
      }`,
    );
  }
}

export function toLibraryCard(
  card: ApiCard,
  userCard: UserCard,
): LibraryCard | null {
  const libraryCard = {
    id: userCard.id,
    name: card.name,
    slug: card.slug,
    type: card.type,
    frameType: card.frameType,
    desc: card.desc,
    atk: card.atk,
    def: card.def,
    level: card.level,
    scale: card.scale,
    linkval: card.linkval,
    linkmarkers: card.linkmarkers,
    race: card.race,
    attribute: card.attribute,
    archetype: card.archetype,
    imageUrl: card.imageUrl,
    banlistInfo: card.banlistInfo,
    cardId: userCard.cardId,
    userId: userCard.userId,
    createdAt: userCard.createdAt,
    updatedAt: userCard.updatedAt,
    issues: userCard.issues.sort((a, b) =>
      a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0,
    ),
    quantity: userCard.issues.reduce((acc, issue) => acc + issue.quantity, 0),
    cardPrices: card.cardPrices,
  } satisfies LibraryCard;

  const validated = LibraryCardSchema.safeParse(libraryCard);

  if (!validated.success) {
    console.error(
      `Invalid library card data: ${JSON.stringify(validated.error.flatten().fieldErrors)}`,
    );
    return null;
  }

  return validated.data as LibraryCard;
}
