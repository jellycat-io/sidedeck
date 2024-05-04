import { z } from 'zod';

export const ApiCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  frameType: z.string(),
  desc: z.string(),
  atk: z.string().optional(),
  def: z.string().optional(),
  level: z.number().optional(),
  scale: z.number().optional(),
  linkval: z.number().optional(),
  linkmarkers: z.array(z.string()).optional(),
  race: z.string().optional(),
  attribute: z.string().optional(),
  archetype: z.string().optional(),
  imageUrl: z.string(),
  cardSets: z.array(
    z.object({
      setName: z.string(),
      setCode: z.string(),
      setPrice: z.string(),
    }),
  ),
  cardPrices: z.array(
    z.object({
      cardmarket: z.string(),
      tcgplayer: z.string(),
      ebay: z.string(),
      amazon: z.string(),
    }),
  ),
  banlistInfo: z
    .object({
      ban_tcg: z.string().optional(),
      ban_ocg: z.string().optional(),
      ban_goat: z.string().optional(),
    })
    .optional(),
});

export const UserCardIssueSchema = z.object({
  id: z.string(),
  language: z
    .enum(['en', 'de', 'fr', 'it', 'es', 'pt', 'jp', 'kr'])
    .default('en'),
  quantity: z.number(),
  tradeable: z.boolean().optional(),
  rarity: z.enum([
    'C',
    'R',
    'SR',
    'HFR',
    'UR',
    'URP',
    'UtR',
    'ScR',
    'QSrR',
    'UScR',
    'ScUR',
    'PScR',
    'PR',
    'SFR',
    'SLR',
    'GR',
    'GUR',
  ]),
  set: z.object({
    setName: z.string(),
    setCode: z.string(),
    setPrice: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserCardIssuesSchema = z.array(UserCardIssueSchema);

export const UserCardSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  userId: z.string(),
  issues: UserCardIssuesSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserCardsSchema = z.array(UserCardSchema);

export const LibraryCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  frameType: z.string(),
  desc: z.string(),
  atk: z.number().optional(),
  def: z.number().optional(),
  level: z.number().optional(),
  scale: z.number().optional(),
  linkval: z.number().optional(),
  linkmarkers: z.array(z.string()).optional(),
  race: z.string().optional(),
  attribute: z.string().optional(),
  archetype: z.string().optional(),
  imageUrl: z.string(),
  banlistInfo: z
    .object({
      ban_tcg: z.string().optional(),
      ban_ocg: z.string().optional(),
      ban_goat: z.string().optional(),
    })
    .optional(),
  cardId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  issues: UserCardIssuesSchema,
  quantity: z.number(),
});

export const GetCardsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
});

export const GetCardSchema = z.object({
  cardId: z.string(),
});

export const GetLibraryCardsSchema = z.object({
  userId: z.string().optional(),
  limit: z.number().optional(),
});

export const AddLibraryCardSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
  issue: UserCardIssueSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const RemoveLibraryCardsSchema = z.object({
  cardIds: z.array(z.string()),
  userId: z.string(),
});

export const UpdateIssueQuantitySchema = z.object({
  cardId: z.string(),
  issueId: z.string(),
  quantity: z.number(),
});

export const UpdateIssuesStatusSchema = z.object({
  cardId: z.string(),
  issueIds: z.array(z.string()),
  status: z.boolean(),
});

export const RemoveIssuesSchema = z.object({
  cardId: z.string(),
  issueIds: z.array(z.string()),
});
