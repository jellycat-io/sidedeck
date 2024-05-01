import { z } from 'zod';

export const GetCardsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
});

export const GetCardSchema = z.object({
  cardId: z.string(),
});

export const GetLibraryCardsSchema = z.object({
  userId: z.string(),
  limit: z.number().optional(),
});

export const AddLibraryCardSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
  quantity: z.number().optional(),
  tradeable: z.boolean().optional(),
});

export const RemoveLibraryCardsSchema = z.object({
  cardIds: z.array(z.string()),
  userId: z.string(),
});

export const UpdateLibraryCardSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
  quantity: z.number(),
  tradeable: z.boolean(),
});
