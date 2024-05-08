import { z } from 'zod';

import {
  ApiCardPriceSchema,
  ApiCardSchema,
  ApiCardSetSchema,
  BanStatusSchema,
  BanlistInfoSchema,
  CardLanguageSchema,
  CardRaceSchema,
  CardRarityCodeSchema,
  CardRarityNameSchema,
  CardTypeSchema,
  CardFrameTypeSchema,
  LibraryCardSchema,
  CardLinkMarkerSchema,
  CardMonsterAttributeSchema,
  UserCardIssueSchema,
  UserCardSchema,
  UserCardSetSchema,
} from '@/schemas/card';

export type MonsterAttribute = z.infer<typeof CardMonsterAttributeSchema>;
export type LinkMarker = z.infer<typeof CardLinkMarkerSchema>;
export type FrameType = z.infer<typeof CardFrameTypeSchema>;
export type CardType = z.infer<typeof CardTypeSchema>;
export type CardRace = z.infer<typeof CardRaceSchema>;
export type CardRarityCode = z.infer<typeof CardRarityCodeSchema>;
export type CardRarityName = z.infer<typeof CardRarityNameSchema>;
export type CardLanguage = z.infer<typeof CardLanguageSchema>;
export type ApiCardSet = z.infer<typeof ApiCardSetSchema>;
export type ApiCardPrice = z.infer<typeof ApiCardPriceSchema>;
export type BanStatus = z.infer<typeof BanStatusSchema>;
export type BanlistInfo = z.infer<typeof BanlistInfoSchema>;
export type ApiCard = z.infer<typeof ApiCardSchema>;
export type UserCard = z.infer<typeof UserCardSchema>;
export type LibraryCard = z.infer<typeof LibraryCardSchema>;
export type LibraryCardIssue = z.infer<typeof UserCardIssueSchema>;
export type LibraryCardSet = z.infer<typeof UserCardSetSchema>;

export const CARD_LANGUAGES = CardLanguageSchema._def.options.map(
  (option) => option.value,
);

export const CARD_TYPES = CardTypeSchema._def.options.map(
  (option) => option.value,
);
