/* -------------------------------------------------------------------------------------------------
 * Definitions
 * -----------------------------------------------------------------------------------------------*/

import { z } from 'zod';

export const DeckCardSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});

export const DeckTypeSchema = z.union([
  z.literal('midrange'),
  z.literal('control'),
  z.literal('combo'),
  z.literal('aggro'),
  z.literal('ramp'),
  z.literal('burn'),
  z.literal('mill'),
]);

export const DeckSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1),
  slug: z.string(),
  description: z.string().optional(),
  type: DeckTypeSchema,
  valid: z.boolean(),
  mainCards: z.array(DeckCardSchema),
  extraCards: z.array(DeckCardSchema),
  sideCards: z.array(DeckCardSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DecksSchema = z.array(DeckSchema);

export const DeckInputSchema = DeckSchema.pick({
  title: true,
  slug: true,
  description: true,
  type: true,
});

/* -------------------------------------------------------------------------------------------------
 * Actions
 * -----------------------------------------------------------------------------------------------*/

export const GetDecks = z.object({
  limit: z.number().optional(),
});

export const GetUserDecksSchema = z.object({
  userId: z.string().optional(),
  limit: z.number().optional(),
});

export const GetDeckSchema = z.object({
  deckId: z.string(),
});

export const GetUserDeckSchema = z.object({
  userId: z.string().optional(),
  deckId: z.string().optional(),
});

export const CreateDeckSchema = z.object({
  userId: z.string().optional(),
  values: DeckInputSchema,
  mainCards: z.array(DeckCardSchema).max(60),
  extraCards: z.array(DeckCardSchema).max(15),
  sideCards: z.array(DeckCardSchema).max(15),
  valid: z.boolean().optional(),
});

export const UpdateDeckSchema = z.object({
  deckId: z.string().optional(),
  values: DeckInputSchema,
  mainCards: z.array(DeckCardSchema),
  extraCards: z.array(DeckCardSchema),
  sideCards: z.array(DeckCardSchema),
  valid: z.boolean().optional(),
});

export const RemoveDeckSchema = z.object({
  deckId: z.string().optional(),
});

export const AddCardToDeckSchema = z.object({
  deckId: z.string(),
  cardId: z.string(),
  cardType: z.union([z.literal('main'), z.literal('extra'), z.literal('side')]),
});

export const RemoveCardFromDeckSchema = z.object({
  deckId: z.string(),
  cardId: z.string(),
  cardType: z.union([z.literal('main'), z.literal('extra'), z.literal('side')]),
});
