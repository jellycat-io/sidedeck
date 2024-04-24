import {
  CardRace,
  CardType,
  FrameType,
  LinkMarker,
  MonsterAttribute,
} from '@prisma/client';

import {
  TYPE_MAPPING,
  ATTRIBUTE_MAPPING,
  LINK_MARKER_MAPPING,
  FRAME_TYPE_MAPPING,
  RACE_MAPPING,
} from './mappings';

export function mapCardType(apiType: string): CardType {
  const mappedType = TYPE_MAPPING[apiType];
  if (!mappedType) {
    throw new Error(`Unknown card type: ${apiType}`);
  }

  return mappedType;
}

export function mapAttribute(
  apiAttribute?: string,
): MonsterAttribute | undefined {
  if (!apiAttribute) {
    return undefined;
  }
  const mappedAttribute = ATTRIBUTE_MAPPING[apiAttribute];
  if (!mappedAttribute) {
    throw new Error(`Unknown monster attribute: ${apiAttribute}`);
  }

  return mappedAttribute;
}

export function mapLinkMarkers(
  apiMarkers?: string[],
): LinkMarker[] | undefined {
  if (!apiMarkers) {
    return undefined;
  }

  const markers: LinkMarker[] = [];
  for (const marker of apiMarkers) {
    if (!LINK_MARKER_MAPPING[marker]) {
      throw new Error(`Unknown link marker: ${marker}`);
    }

    markers.push(LINK_MARKER_MAPPING[marker]);
  }

  return markers;
}

export function mapFrameType(apiFrame: string): FrameType {
  const mappedFrame = FRAME_TYPE_MAPPING[apiFrame];
  if (!mappedFrame) {
    throw new Error(`Unknown frame type: ${apiFrame}`);
  }

  return mappedFrame;
}

export function mapRace(apiRace?: string): CardRace | undefined {
  if (!apiRace) {
    return undefined;
  }

  const mappedRace = RACE_MAPPING[apiRace];
  if (!mappedRace) {
    throw new Error(`Unknown card race: ${apiRace}`);
  }

  return mappedRace;
}
