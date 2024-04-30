import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Card } from '@/types/cards';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Checks if a query is a fuzzy match for a target string
 * @param cardName  The name of the card to match against
 * @param query The query to match against the card name
 * @returns true if the query is a fuzzy match for the card name, false otherwise
 */
export function fuzzyMatch(target: string, query: string) {
  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();
  let queryIndex = 0;

  for (const char of targetLower) {
    if (char === queryLower[queryIndex]) {
      queryIndex++;
      if (queryIndex === queryLower.length) {
        return true; // All characters in the query have been found consecutively in the card name
      }
    }
  }
  return false; // Not all characters were found in order
}

export function getFrametypeColors(card: Pick<Card, 'frameType' | 'slug'>) {
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
        bg: '270 25% 62%',
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
        bg: '240 100% 27%',
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
