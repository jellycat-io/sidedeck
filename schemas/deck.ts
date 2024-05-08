/* -------------------------------------------------------------------------------------------------
 * Definitions
 * -----------------------------------------------------------------------------------------------*/

import { z } from 'zod';

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
  mainCardIds: z.array(z.string()),
  extraCardIds: z.array(z.string()),
  sideCardIds: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DecksSchema = z.array(DeckSchema);

export const DeckInputSchema = DeckSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
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
});

export const UpdateDeckSchema = z.object({
  deckId: z.string().optional(),
  values: DeckInputSchema,
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
