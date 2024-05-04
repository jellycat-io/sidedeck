import { z } from 'zod';

import { UserCardSchema } from '@/schemas/card';

export type CardType =
  | 'effect_monster'
  | 'fusion_monster'
  | 'flip_effect_monster'
  | 'flip_tuner_effect_monster'
  | 'gemini_monster'
  | 'link_monster'
  | 'normal_monster'
  | 'normal_tuner_monster'
  | 'pendulum_effect_monster'
  | 'pendulum_effect_fusion_monster'
  | 'pendulum_effect_ritual_monster'
  | 'pendulum_flip_effect_monster'
  | 'pendulum_normal_monster'
  | 'pendulum_tuner_effect_monster'
  | 'ritual_effect_monster'
  | 'ritual_monster'
  | 'spell_card'
  | 'spirit_monster'
  | 'synchro_monster'
  | 'synchro_pendulum_effect_monster'
  | 'synchro_tuner_monster'
  | 'toon_monster'
  | 'token'
  | 'trap_card'
  | 'tuner_monster'
  | 'union_effect_monster'
  | 'xyz_monster'
  | 'xyz_pendulum_effect_monster';

export type MonsterAttribute =
  | 'dark'
  | 'divine'
  | 'earth'
  | 'fire'
  | 'light'
  | 'water'
  | 'wind';

export type LinkMarker =
  | 'top'
  | 'top_right'
  | 'right'
  | 'bottom_right'
  | 'bottom'
  | 'bottom_left'
  | 'left'
  | 'top_left';

export type FrameType =
  | 'normal'
  | 'effect'
  | 'fusion'
  | 'ritual'
  | 'synchro'
  | 'xyz'
  | 'normal_pendulum'
  | 'effect_pendulum'
  | 'fusion_pendulum'
  | 'ritual_pendulum'
  | 'synchro_pendulum'
  | 'xyz_pendulum'
  | 'link'
  | 'spell'
  | 'trap'
  | 'token';

export type CardRace =
  | 'aqua'
  | 'beast'
  | 'beast_warrior'
  | 'continuous'
  | 'counter'
  | 'creator_god'
  | 'cyberse'
  | 'dinosaur'
  | 'divine_beast'
  | 'dragon'
  | 'equip'
  | 'fairy'
  | 'field'
  | 'fiend'
  | 'fish'
  | 'illusion'
  | 'insect'
  | 'machine'
  | 'normal'
  | 'plant'
  | 'psychic'
  | 'pyro'
  | 'quick_play'
  | 'reptile'
  | 'ritual'
  | 'rock'
  | 'sea_serpent'
  | 'spellcaster'
  | 'thunder'
  | 'warrior'
  | 'winged_beast'
  | 'wyrm'
  | 'zombie';

export type CardRarityCode =
  | 'C'
  | 'R'
  | 'SR'
  | 'HFR'
  | 'UR'
  | 'URP'
  | 'UtR'
  | 'ScR'
  | 'QSrR'
  | 'UScR'
  | 'ScUR'
  | 'PScR'
  | 'PR'
  | 'SFR'
  | 'SLR'
  | 'GR'
  | 'GUR';

export type CardRarityName =
  | 'Common'
  | 'Rare'
  | 'Super Rare'
  | 'Holographic Foil Rare'
  | 'Ultra Rare'
  | "Ultra Rare Pharaoh's Rare"
  | 'Ultimate Rare'
  | 'Secret Rare'
  | 'Quarter Century Secret Rare'
  | 'Ultra-Secret Rare'
  | 'Secret-Ultra Rare'
  | 'Prismatic Secret Rare'
  | 'Parallel Rare'
  | 'Starfoil Rare'
  | 'Starlight Rare'
  | 'Ghost Rare'
  | 'Ghost Ultra Rare';

export const CARD_LANGUAGES = [
  'en',
  'de',
  'fr',
  'it',
  'es',
  'pt',
  'jp',
  'kr',
] as const;

export type CardLanguage = (typeof CARD_LANGUAGES)[number];

export interface ApiCardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

export interface ApiCardPrice {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}

type BanStatus = 'Banned' | 'Limited' | 'Semi-Limited';

export interface BanlistInfo {
  ban_tcg: BanStatus;
  ban_ocg: BanStatus;
  ban_goat: BanStatus;
}

export interface ApiCard {
  id: string;
  name: string;
  slug: string;
  type: CardType;
  frameType: FrameType;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  scale?: number;
  linkval?: number;
  linkmarkers?: LinkMarker[];
  race?: CardRace;
  attribute?: MonsterAttribute;
  archetype?: string;
  imageUrl: string;
  cardSets: ApiCardSet[];
  cardPrices: ApiCardPrice[];
  banlistInfo?: BanlistInfo;
}

export type UserCard = z.infer<typeof UserCardSchema>;

export interface LibraryCard
  extends Omit<ApiCard, 'id' | 'cardSets' | 'cardPrices'>,
    UserCard {
  quantity: number;
}

export interface LibraryCardIssue {
  id: string;
  language: CardLanguage;
  quantity: number;
  tradeable?: boolean;
  rarity: CardRarityCode;
  set: LibraryCardSet;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryCardSet {
  setName: string;
  setCode: string;
  setPrice: string;
}

export type LibraryCardSummary = {
  id: string;
  name: string;
  slug: string;
  type: CardType;
  frameType: FrameType;
  quantity: number;
  tradeable: boolean;
};
