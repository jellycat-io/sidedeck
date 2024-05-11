import { z } from 'zod';

import {
  DeckCardSchema,
  DeckListSchema,
  DeckListTypeSchema,
  DeckSchema,
  DeckTypeSchema,
} from '@/schemas/deck';

export type DeckCard = z.infer<typeof DeckCardSchema>;
export type DeckList = z.infer<typeof DeckListSchema>;
export type DeckListType = z.infer<typeof DeckListTypeSchema>;
export type DeckType = z.infer<typeof DeckTypeSchema>;
export type Deck = z.infer<typeof DeckSchema>;

export const DECK_TYPES = DeckTypeSchema._def.options.map(
  (option) => option.value,
);
