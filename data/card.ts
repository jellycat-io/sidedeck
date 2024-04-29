import chalk from 'chalk';

import fs from 'fs';
import path from 'path';

import { fuzzyMatch } from '@/lib/utils';
import { Card } from '@/types/cards';

// Construct the path to the JSON file
const CARDS_JSON_PATH = path.join(process.cwd(), 'data/cards.json');

function loadCards(): Card[] {
  try {
    console.log(chalk.blue(`Loading cards data...`));
    const data = fs.readFileSync(CARDS_JSON_PATH, 'utf8');
    console.log(chalk.green(`Loaded cards data!`));
    return JSON.parse(data);
  } catch (error) {
    throw new Error(
      `Error loading cards data: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getCards() {
  try {
    return loadCards();
  } catch (error) {
    throw new Error(
      `Error getting cards: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getCardById(id: string) {
  try {
    const cards = loadCards();
    const card = cards.find((card) => card.id === id);
    return card;
  } catch (error) {
    throw new Error(
      `Error getting card by id: ${id}, ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getCardByName(name: string) {
  try {
    const cards = loadCards();
    const card = cards.find((card) => card.name === name);
    return card;
  } catch (error) {
    throw new Error(
      `Error getting card by name: ${name}, ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getCardsByQuery(query: string) {
  try {
    const cards = loadCards();
    return cards.filter((c) => fuzzyMatch(c.name, query));
  } catch (error) {
    throw new Error(
      `Error getting cards by query: ${query}, ${error instanceof Error ? error.message : error}`,
    );
  }
}
