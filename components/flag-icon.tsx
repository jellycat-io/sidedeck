import Image from 'next/image';

import { CardLanguage } from '@/types/card';

interface FlagIconProps {
  locale: CardLanguage;
}

export function FlagIcon({ locale }: FlagIconProps) {
  return (
    <Image
      src={`/icons/flags/${locale}.svg`}
      alt={locale}
      width={24}
      height={24}
      className='h-5 w-5 rounded-full'
    />
  );
}
