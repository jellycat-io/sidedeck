import { z } from 'zod';

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

interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

interface CardPrice {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}

interface BanlistInfo {
  ban_tcg: string;
  ban_ocg: string;
  ban_goat: string;
}

export interface Card {
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
  cardSets: CardSet[];
  cardPrices: CardPrice[];
  banlistInfo?: BanlistInfo;
}
