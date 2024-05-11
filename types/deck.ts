import { z } from 'zod';

import { DeckCardSchema, DeckSchema, DeckTypeSchema } from '@/schemas/deck';

export type DeckCard = z.infer<typeof DeckCardSchema>;
export type DeckType = z.infer<typeof DeckTypeSchema>;
export type Deck = z.infer<typeof DeckSchema>;

export const DECK_TYPES = DeckTypeSchema._def.options.map(
  (option) => option.value,
);
