import { z } from 'zod';

export const GetCardsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
});

export const GetCardSchema = z.object({
  cardId: z.string(),
});
