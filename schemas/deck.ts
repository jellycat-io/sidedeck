/* -------------------------------------------------------------------------------------------------
 * Definitions
 * -----------------------------------------------------------------------------------------------*/

import { DeckListType } from '@prisma/client';
import { z } from 'zod';

export const DeckCardSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});

export const DeckListTypeSchema = z.nativeEnum(DeckListType);

export const DeckListSchema = z.object({
  type: z.nativeEnum(DeckListType),
  cards: z.array(DeckCardSchema),
});
// .refine((data) => {
//   if (
//     data.type === DeckListType.MAIN &&
//     (data.cards.length < 40 || data.cards.length > 60)
//   ) {
//     return false;
//   }

//   if (data.type === DeckListType.EXTRA && data.cards.length > 15) {
//     return false;
//   }

//   if (data.type === DeckListType.SIDE && data.cards.length > 15) {
//     return false;
//   }

//   return true;
// });

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
  lists: z.array(DeckListSchema),
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
  meta: DeckInputSchema,
  lists: z.array(DeckListSchema),
  valid: z.boolean().optional(),
});

export const UpdateDeckSchema = z.object({
  deckId: z.string().optional(),
  meta: DeckInputSchema,
  lists: z.array(DeckListSchema),
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
