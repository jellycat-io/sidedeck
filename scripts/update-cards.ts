import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import FormData from 'form-data';
import fetch from 'node-fetch';

import fs from 'fs';

import {
  mapAttribute,
  mapCardType,
  mapFrameType,
  mapLinkMarkers,
  mapRace,
} from '../lib/cards/helpers';
import { db } from '../lib/db';

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

const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

let cards: ApiCardData[] | null = null;

async function fetchCards() {
  if (cards !== null) {
    console.log('Using cached card data');
    return cards;
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch cards: ${response.statusText}`);
  }
  const data = (await response.json()) as ApiResponse;

  cards = data.data.filter((c) => c.frameType !== 'skill');

  const storedCards = await prisma.card.findMany();

  return cards.filter((card) => !storedCards.some((c) => c.id === card.id));
}

async function uploadImageToVercel(
  imagePath: string,
  imageName: string,
  card: {
    id: number;
    name: string;
  }
) {
  const imageResponse = await fetch(imagePath);
  const blob = await imageResponse.blob();

  const response = await put(imageName, blob, {
    access: 'public',
  });

  console.log(`Uploaded image for <${card.id}> ${card.name}: ${response.url}`);

  return response.url;
}

async function updateDatabaseAndUploadImages() {
  const cards = await fetchCards();

  for (const card of cards) {
    const existingCard = await prisma.card.findUnique({
      where: { id: card.id },
    });

    if (existingCard) console.log(`Card already stored: ${card.name}`);

    if (!existingCard) {
      const imageUrl = await uploadImageToVercel(
        card.card_images[0].image_url,
        `${card.id}.jpg`,
        {
          id: card.id,
          name: card.name,
        }
      );

      if (!imageUrl) {
        throw new Error(`Failed to upload image for ${card.name}`);
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
      console.log(`Added new card: ${card.name}`);
    }
  }
}

updateDatabaseAndUploadImages().catch(console.error);
