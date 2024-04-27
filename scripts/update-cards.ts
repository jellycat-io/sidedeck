import { PrismaClient } from '@prisma/client';
import { ListBlobResult, ListBlobResultBlob, list, put } from '@vercel/blob';
import chalk from 'chalk';
import fetch from 'node-fetch';

import { exit } from 'process';

import {
  mapAttribute,
  mapCardType,
  mapFrameType,
  mapLinkMarkers,
  mapRace,
} from '../lib/cards/helpers';

interface ApiCardData {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  scale?: number;
  linkval?: number;
  linkmarkers?: string[];
  race?: string;
  attribute?: string;
  archetype?: string;
  ygoprodeck_url: string;
  card_sets: {
    set_name: string;
    set_code: string;
    set_rarity: string;
    set_rarity_code: string;
    set_price: string;
  }[];
  card_images: {
    id: number;
    image_url: string;
    image_url_small: string;
    image_url_cropped: string;
  }[];
  card_prices: {
    cardmarket_price: string;
    tcgplayer_price: string;
    ebay_price: string;
    amazon_price: string;
    coolstuffinc_price: string;
  }[];
  banlist_info?: {
    ban_tcg: string;
    ban_ocg: string;
    ban_goat: string;
  };
}

type ApiResponse = {
  data: ApiCardData[];
};

const prisma = new PrismaClient();

const log = console.log;

const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

let cards: ApiCardData[] | null = null;

async function fetchCards() {
  if (cards !== null) {
    log('Using cached card data');
    return cards;
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch cards: ${response.statusText}`);
  }
  const data = (await response.json()) as ApiResponse;

  cards = data.data.filter((c) => c.frameType !== 'skill');

  const storedCards = await prisma.card.findMany();

  const newCards = cards.filter(
    (card) => !storedCards.some((c) => c.id === card.id),
  );

  if (newCards.length === 0) {
    log(chalk.green('No new cards to store!'));
    exit(0);
  }

  log(chalk.yellow(`${storedCards.length} cards already stored`));
  log(chalk.green(`${newCards.length} new cards to store`));

  return newCards;
}

async function getAllBlobs() {
  const allBlobs = [];
  let continuationToken;

  do {
    const blobs: ListBlobResult = await list({
      cursor: continuationToken,
    });

    allBlobs.push(...blobs.blobs);
    continuationToken = blobs.cursor;
  } while (continuationToken);

  return allBlobs;
}

async function checkBlobExists(blobs: ListBlobResultBlob[], pathname: string) {
  return blobs.find((blob) => blob.pathname === pathname);
}

async function uploadImageToVercel(
  imagePath: string,
  imageName: string,
  card: {
    id: number;
    name: string;
  },
) {
  const imageResponse = await fetch(imagePath);
  const blob = await imageResponse.blob();

  log(chalk.blue(`Uploading blob...`));

  const response = await put(imageName, blob, {
    access: 'public',
  });

  log(chalk.green(`Blob uploaded: ${response.url}!`));

  return response.url;
}

async function updateDatabaseAndUploadImages() {
  log(chalk.blue('Gettings cards from ygoprodeck API...'));
  const cards = await fetchCards();
  log(chalk.green('Cards fetched!'));
  log(chalk.blue('Getting blobs from Vercel...'));
  const blobs = await getAllBlobs();
  log(chalk.green('Blobs fetched!'));

  for (const card of cards) {
    const existingCard = await prisma.card.findUnique({
      where: { id: card.id },
    });

    if (existingCard) {
      console.log(chalk.yellow(`Card already stored: ${card.name}`));
      continue;
    }

    log('------------------------------------');
    log(chalk.bold(`${card.name} <${card.id}>`));

    let imageUrl;

    const existingBlob = await checkBlobExists(blobs, `${card.id}.jpg`);

    if (existingBlob) {
      imageUrl = existingBlob.url;
      console.log(chalk.yellow(`Blob already exists`));
    } else {
      const blobUrl = await uploadImageToVercel(
        card.card_images[0].image_url,
        `${card.id}.jpg`,
        {
          id: card.id,
          name: card.name,
        },
      );

      if (!blobUrl) {
        throw new Error(`Failed to upload blob for ${card.name}`);
      }

      imageUrl = blobUrl;
    }

    if (!imageUrl) {
      throw new Error(`No image url for ${card.name}`);
    }

    await prisma.card.create({
      data: {
        id: card.id,
        name: card.name,
        type: mapCardType(card.type),
        desc: card.desc,
        atk: card.atk,
        def: card.def,
        level: card.level,
        scale: card.scale,
        linkval: card.linkval,
        archetype: card.archetype,
        image_url: imageUrl,
        frameType: mapFrameType(card.frameType),
        linkmarkers: mapLinkMarkers(card.linkmarkers),
        race: mapRace(card.race),
        attribute: mapAttribute(card.attribute),
        card_sets: card.card_sets,
        card_prices: card.card_prices,
        banlist_info: card.banlist_info,
      },
    });

    log(chalk.green(`Card stored!`));
  }
}

updateDatabaseAndUploadImages().catch(console.error);
