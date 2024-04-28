import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
 * Converts a string to snake case
 * @example toSnakeCase('Hello World') // 'hello_world'
 * @param str the string to convert to snake case
 * @returns the snake case string
 */
export function toSnakeCase(str: string) {
  return str
    .split(/[\s-]/)
    .map((part) => part.toLowerCase())
    .join('_');
}
