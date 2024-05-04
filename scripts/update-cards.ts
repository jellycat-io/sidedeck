import { ListBlobResult, ListBlobResultBlob, list, put } from '@vercel/blob';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { toSnakeCase } from '@/lib/utils';
import {
  BanlistInfo,
  ApiCard,
  CardRace,
  CardType,
  FrameType,
  LinkMarker,
  MonsterAttribute,
} from '@/types/cards';

dotenv.config();

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

const log = console.log;

const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
const CARDS_JSON_PATH = path.join(__dirname, '../data/cards.json');

async function fetchCards(): Promise<ApiCardData[]> {
  try {
    log(chalk.blue(`Fetching cards from Ygoprodeck api...`));
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch cards: ${response.statusText}`);
    }
    const data = (await response.json()) as ApiResponse;

    log(chalk.green(`Fetched ${data.data.length} cards!`));
    return data.data.filter((c) => c.frameType !== 'skill');
  } catch (error) {
    log(
      chalk.red(
        `Error fetching cards: ${error instanceof Error ? error.message : error}`,
      ),
    );
    throw error;
  }
}

async function loadStoredCards(): Promise<ApiCard[]> {
  if (!existsSync(CARDS_JSON_PATH)) {
    return [];
  }
  log(chalk.blue(`Loading stored cards...`));
  const fileData = readFileSync(CARDS_JSON_PATH);
  return JSON.parse(fileData.toString());
}

async function saveCards(cards: ApiCard[]): Promise<void> {
  log(chalk.blue(`Saving cards...`));
  writeFileSync(CARDS_JSON_PATH, JSON.stringify(cards, null, 2));
  log(chalk.green(`Cards saved!`));
}

async function getAllBlobs(): Promise<ListBlobResultBlob[]> {
  try {
    const allBlobs = [];
    let continuationToken;

    log(chalk.blue(`Fetching blobs...`));

    do {
      const { blobs, cursor }: ListBlobResult = await list({
        cursor: continuationToken,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      allBlobs.push(...blobs);
      continuationToken = cursor;
    } while (continuationToken);

    log(chalk.green(`Fetched ${allBlobs.length} blobs!`));
    return allBlobs;
  } catch (error) {
    log(
      chalk.red(
        `Error fetching blobs: ${error instanceof Error ? error.message : error}`,
      ),
    );
    throw error;
  }
}

async function checkBlobExists(
  blobs: ListBlobResultBlob[],
  pathname: string,
): Promise<ListBlobResultBlob | undefined> {
  return blobs.find((blob) => blob.pathname === pathname);
}

async function uploadImageToVercel(
  imagePath: string,
  imageName: string,
): Promise<string> {
  try {
    const imageResponse = await fetch(imagePath);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const blob = await imageResponse.blob();

    log(chalk.blue(`Uploading blob...`));

    const response = await put(imageName, blob, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
      access: 'public',
    });

    log(chalk.green(`Blob uploaded: ${response.url}!`));

    return response.url;
  } catch (error) {
    log(
      chalk.red(
        `Error uploading image: ${error instanceof Error ? error.message : error}`,
      ),
    );
    throw error;
  }
}

async function updateCards(): Promise<void> {
  try {
    const [apiCards, storedCards, blobs] = await Promise.all([
      fetchCards(),
      loadStoredCards(),
      getAllBlobs(),
    ]);

    const newCards: ApiCardData[] = apiCards.filter(
      (apiCard) =>
        !storedCards.some(
          (storedCard) => storedCard.id === apiCard.id.toString(),
        ),
    );

    log(chalk.blue(`Total cards already stored: ${storedCards.length}`));
    log(chalk.blue(`New cards found: ${newCards.length}`));

    if (newCards.length === 0) {
      log(chalk.green('File is up-to-date with the API.'));
      process.exit(0);
    }

    const uploadPromises: Promise<ApiCard>[] = newCards.map(async (apiCard) => {
      const existingBlob = await checkBlobExists(blobs, `${apiCard.id}.jpg`);

      let imageUrl = '';

      if (existingBlob) {
        log(chalk.yellow(`Blob already exists: ${existingBlob.url}`));
        imageUrl = existingBlob.url;
      } else {
        imageUrl = await uploadImageToVercel(
          apiCard.card_images[0].image_url,
          `${apiCard.id}.jpg`,
        );
      }

      return {
        id: apiCard.id.toString(),
        name: apiCard.name,
        slug: toSnakeCase(apiCard.name),
        type: toSnakeCase(apiCard.type) as CardType,
        frameType: toSnakeCase(apiCard.frameType) as FrameType,
        desc: apiCard.desc,
        atk: apiCard.atk,
        def: apiCard.def,
        level: apiCard.level,
        scale: apiCard.scale,
        linkval: apiCard.linkval,
        archetype: apiCard.archetype,
        imageUrl,
        linkmarkers: apiCard.linkmarkers?.map(toSnakeCase) as
          | LinkMarker[]
          | undefined,
        race: apiCard.race
          ? (toSnakeCase(apiCard.race) as CardRace)
          : undefined,
        attribute: apiCard.attribute
          ? (toSnakeCase(apiCard.attribute) as MonsterAttribute)
          : undefined,
        cardSets: apiCard.card_sets,
        cardPrices: apiCard.card_prices,
        banlistInfo: apiCard.banlist_info as BanlistInfo,
      };
    });

    const updatedCards = await Promise.all(uploadPromises);
    const allCards = [...storedCards, ...updatedCards];

    await saveCards(allCards);

    log(chalk.green(`Total cards stored after update: ${allCards.length}`));
  } catch (error) {
    log(
      chalk.red(
        `Error updating cards: ${error instanceof Error ? error.message : error}`,
      ),
    );
  }
}

updateCards().catch(console.error);
