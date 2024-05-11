import { CardLanguage, CardRarity } from '@prisma/client';
import { z } from 'zod';

/* -------------------------------------------------------------------------------------------------
 * Definitions
 * -----------------------------------------------------------------------------------------------*/

export const CardTypeSchema = z.union([
  z.literal('effect_monster'),
  z.literal('fusion_monster'),
  z.literal('flip_effect_monster'),
  z.literal('flip_tuner_effect_monster'),
  z.literal('gemini_monster'),
  z.literal('link_monster'),
  z.literal('normal_monster'),
  z.literal('normal_tuner_monster'),
  z.literal('pendulum_effect_monster'),
  z.literal('pendulum_effect_fusion_monster'),
  z.literal('pendulum_effect_ritual_monster'),
  z.literal('pendulum_flip_effect_monster'),
  z.literal('pendulum_normal_monster'),
  z.literal('pendulum_tuner_effect_monster'),
  z.literal('ritual_effect_monster'),
  z.literal('ritual_monster'),
  z.literal('spell_card'),
  z.literal('spirit_monster'),
  z.literal('synchro_monster'),
  z.literal('synchro_pendulum_effect_monster'),
  z.literal('synchro_tuner_monster'),
  z.literal('toon_monster'),
  z.literal('token'),
  z.literal('trap_card'),
  z.literal('tuner_monster'),
  z.literal('union_effect_monster'),
  z.literal('xyz_monster'),
  z.literal('xyz_pendulum_effect_monster'),
]);

export const CardMonsterAttributeSchema = z.union([
  z.literal('dark'),
  z.literal('divine'),
  z.literal('earth'),
  z.literal('fire'),
  z.literal('light'),
  z.literal('water'),
  z.literal('wind'),
]);

export const CardLinkMarkerSchema = z.union([
  z.literal('top'),
  z.literal('top_right'),
  z.literal('right'),
  z.literal('bottom_right'),
  z.literal('bottom'),
  z.literal('bottom_left'),
  z.literal('left'),
  z.literal('top_left'),
]);

export const CardFrameTypeSchema = z.union([
  z.literal('normal'),
  z.literal('effect'),
  z.literal('fusion'),
  z.literal('ritual'),
  z.literal('synchro'),
  z.literal('xyz'),
  z.literal('normal_pendulum'),
  z.literal('effect_pendulum'),
  z.literal('fusion_pendulum'),
  z.literal('ritual_pendulum'),
  z.literal('synchro_pendulum'),
  z.literal('xyz_pendulum'),
  z.literal('link'),
  z.literal('spell'),
  z.literal('trap'),
  z.literal('token'),
]);

export const CardRaceSchema = z.union([
  z.literal('aqua'),
  z.literal('beast'),
  z.literal('beast_warrior'),
  z.literal('continuous'),
  z.literal('counter'),
  z.literal('creator_god'),
  z.literal('cyberse'),
  z.literal('dinosaur'),
  z.literal('divine_beast'),
  z.literal('dragon'),
  z.literal('equip'),
  z.literal('fairy'),
  z.literal('field'),
  z.literal('fiend'),
  z.literal('fish'),
  z.literal('illusion'),
  z.literal('insect'),
  z.literal('machine'),
  z.literal('normal'),
  z.literal('plant'),
  z.literal('psychic'),
  z.literal('pyro'),
  z.literal('quick_play'),
  z.literal('reptile'),
  z.literal('ritual'),
  z.literal('rock'),
  z.literal('sea_serpent'),
  z.literal('spellcaster'),
  z.literal('thunder'),
  z.literal('warrior'),
  z.literal('winged_beast'),
  z.literal('wyrm'),
  z.literal('zombie'),
]);

export const CardRarityCodeSchema = z.nativeEnum(CardRarity);

export const CardRarityNameSchema = z.union([
  z.literal('Common'),
  z.literal('Rare'),
  z.literal('Super Rare'),
  z.literal('Holographic Foil Rare'),
  z.literal('Ultra Rare'),
  z.literal("Ultra Rare Pharaoh's Rare"),
  z.literal('Ultimate Rare'),
  z.literal('Secret Rare'),
  z.literal('Quarter Century Secret Rare'),
  z.literal('Ultra-Secret Rare'),
  z.literal('Secret-Ultra Rare'),
  z.literal('Prismatic Secret Rare'),
  z.literal('Parallel Rare'),
  z.literal('Starfoil Rare'),
  z.literal('Starlight Rare'),
  z.literal('Ghost Rare'),
  z.literal('Ghost Ultra Rare'),
]);

export const CardLanguageSchema = z.nativeEnum(CardLanguage);

export const ApiCardSetSchema = z.object({
  set_name: z.string(),
  set_code: z.string(),
  set_rarity: z.string(),
  set_rarity_code: z.string(),
  set_price: z.string(),
});

export const ApiCardPriceSchema = z.object({
  cardmarket_price: z.string(),
  tcgplayer_price: z.string(),
  ebay_price: z.string(),
  amazon_price: z.string(),
  coolstuffinc_price: z.string(),
});

export const BanStatusSchema = z.union([
  z.literal('Banned'),
  z.literal('Limited'),
  z.literal('Semi-Limited'),
]);

export const BanlistInfoSchema = z.object({
  ban_tcg: BanStatusSchema.optional(),
  ban_ocg: BanStatusSchema.optional(),
  ban_goat: BanStatusSchema.optional(),
});

export const ApiCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: CardTypeSchema,
  frameType: CardFrameTypeSchema,
  desc: z.string(),
  atk: z.number().optional(),
  def: z.number().optional(),
  level: z.number().optional(),
  scale: z.number().optional(),
  linkval: z.number().optional(),
  linkmarkers: z.array(CardLinkMarkerSchema).optional(),
  race: CardRaceSchema.optional(),
  attribute: CardMonsterAttributeSchema.optional(),
  archetype: z.string().optional(),
  imageUrl: z.string(),
  cardSets: z.array(ApiCardSetSchema),
  cardPrices: z.array(ApiCardPriceSchema),
  banlistInfo: BanlistInfoSchema.optional(),
});

export const UserCardSetSchema = z.object({
  setName: z.string(),
  setCode: z.string(),
  setPrice: z.string(),
});

export const UserCardIssueSchema = z.object({
  id: z.string(),
  language: CardLanguageSchema,
  quantity: z.number(),
  tradeable: z.boolean(),
  rarity: CardRarityCodeSchema,
  set: UserCardSetSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
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

export const LibraryCardSchema = z
  .intersection(
    UserCardSchema,
    ApiCardSchema.omit({ id: true, cardSets: true }),
  )
  .and(z.object({ quantity: z.number() }));

/* -------------------------------------------------------------------------------------------------
 * Actions
 * -----------------------------------------------------------------------------------------------*/

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
  card: z.object({
    id: z.string(),
    name: z.string(),
  }),
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
