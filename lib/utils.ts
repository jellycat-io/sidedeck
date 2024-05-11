import { type ClassValue, clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

import {
  CardLanguage,
  CardRarityCode,
  CardRarityName,
  LibraryCard,
} from '@/types/card';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isDateInRange(value: string, start: string, end: string) {
  const date = new Date(value).getDate();
  const startDate = new Date(start).getDate();
  const endDate = new Date(end).getDate();

  return date >= startDate && date <= endDate;
}

export function dateRangeFilterFn(row: any, id: string, filterValue: any) {
  if (!filterValue.start && !filterValue.end) return true;

  const endDateString = filterValue.end ?? new Date().toISOString();

  return isDateInRange(row.original[id], filterValue.start, endDateString);
}

/**
 * Converts a camel case string to capitalized
 * @param str the camel case string to convert to capitalized
 * @returns the capitalized string
 */
export function camelCasetoCapitalized(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/**
 * Converts a snake case string to capitalized
 * @example snakeCaseToCapitalized('hello_world') // 'Hello World'
 * @param str the snake case string to convert to capitalized
 * @returns the capitalized string
 */
export function snakeCaseToCapitalized(str: string) {
  return str
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Converts any string to snake case
 * @param str the string to convert to snake case
 * @returns the snake case string
 */
export function toSnakeCase(str: string) {
  return str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
}

export function getFrametypeColors(
  card: Pick<LibraryCard, 'frameType' | 'slug'>,
) {
  if (card.slug === 'slifer_the_sky_dragon')
    return {
      bg: '0 100% 50%',
      text: '0 0% 3.9%',
    };
  if (card.slug === 'obelisk_the_tormentor')
    return {
      bg: '241 51% 40%',
      text: '0 0% 98%',
    };
  if (card.slug === 'the_winged_dragon_of_ra')
    return {
      bg: '50 100% 51%',
      text: '0 0% 3.9%',
    };

  switch (card.frameType) {
    case 'normal':
      return {
        bg: '48 95% 76%',
        text: '0 0% 3.9%',
      };
    case 'effect':
      return {
        bg: '20 100% 66%',
        text: '0 0% 3.9%',
      };
    case 'fusion':
      return {
        bg: '291 38% 45%',
        text: '0 0% 3.9%',
      };
    case 'ritual':
      return {
        bg: '209 31% 71%',
        text: '0 0% 3.9%',
      };
    case 'synchro':
      return {
        bg: '0 0% 80%',
        text: '0 0% 3.9%',
      };
    case 'xyz':
      return {
        bg: '0 0% 33%',
        text: '0 0% 98%',
      };
    case 'link':
      return {
        bg: '210 77% 29%',
        text: '0 0% 98%',
      };
    case 'normal_pendulum':
    case 'effect_pendulum':
    case 'fusion_pendulum':
    case 'ritual_pendulum':
    case 'synchro_pendulum':
    case 'xyz_pendulum':
      return {
        bg: '154 32% 70%',
        text: '0 0% 3.9%',
      };
    case 'spell':
      return {
        bg: '160 68% 37%',
        text: '0 0% 98%',
      };
    case 'trap':
      return {
        bg: '335 43% 55%',
        text: '0 0% 98%',
      };
    case 'token':
      return {
        bg: '0 0% 75%',
        text: '0 0% 3.9%',
      };
  }
}

export function keyToLanguage(key: CardLanguage): string {
  switch (key) {
    case 'en':
      return 'English';
    case 'de':
      return 'German';
    case 'fr':
      return 'French';
    case 'it':
      return 'Italian';
    case 'es':
      return 'Spanish';
    case 'pt':
      return 'Portuguese';
    case 'jp':
      return 'Japanese';
    case 'kr':
      return 'Korean';
  }
}

export function codeToRarityName(code: CardRarityCode): CardRarityName {
  switch (code) {
    case 'C':
      return 'Common';
    case 'R':
      return 'Rare';
    case 'SR':
      return 'Super Rare';
    case 'HFR':
      return 'Holographic Foil Rare';
    case 'UR':
      return 'Ultra Rare';
    case 'URP':
      return "Ultra Rare Pharaoh's Rare";
    case 'UtR':
      return 'Ultimate Rare';
    case 'ScR':
      return 'Secret Rare';
    case 'QSrR':
      return 'Quarter Century Secret Rare';
    case 'UScR':
      return 'Ultra-Secret Rare';
    case 'ScUR':
      return 'Secret-Ultra Rare';
    case 'PScR':
      return 'Prismatic Secret Rare';
    case 'PR':
      return 'Parallel Rare';
    case 'SFR':
      return 'Starfoil Rare';
    case 'SLR':
      return 'Starlight Rare';
    case 'GR':
      return 'Ghost Rare';
    case 'GUR':
      return 'Ghost Ultra Rare';
  }
}

export function rarityNameToCode(name: CardRarityName): CardRarityCode {
  switch (name) {
    case 'Common':
      return 'C';
    case 'Rare':
      return 'R';
    case 'Super Rare':
      return 'SR';
    case 'Holographic Foil Rare':
      return 'HFR';
    case 'Ultra Rare':
      return 'UR';
    case "Ultra Rare Pharaoh's Rare":
      return 'URP';
    case 'Ultimate Rare':
      return 'UtR';
    case 'Secret Rare':
      return 'ScR';
    case 'Quarter Century Secret Rare':
      return 'QSrR';
    case 'Ultra-Secret Rare':
      return 'UScR';
    case 'Secret-Ultra Rare':
      return 'ScUR';
    case 'Prismatic Secret Rare':
      return 'PScR';
    case 'Parallel Rare':
      return 'PR';
    case 'Starfoil Rare':
      return 'SFR';
    case 'Starlight Rare':
      return 'SLR';
    case 'Ghost Rare':
      return 'GR';
    case 'Ghost Ultra Rare':
      return 'GUR';
  }
}

export function sanitizeRarityCode(code: string): CardRarityCode {
  const safeCode = code.replace(/[()]/g, '') as CardRarityCode;
  return safeCode;
}

export function formatDateFromNow(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
  });
}
