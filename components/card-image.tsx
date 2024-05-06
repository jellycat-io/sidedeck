'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CardImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}
export function CardImage({
  src,
  alt,
  size = 'md',
  className,
  onClick,
}: CardImageProps) {
  const [loading, setLoading] = useState(true);

  // Event handler for image loading completion
  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const width = useMemo(() => {
    switch (size) {
      case 'sm':
        return 175;
      case 'md':
        return 250;
      case 'lg':
        return 325;
      default:
        return 250;
    }
  }, [size]);

  const height = (width / 5) * 7;

  return (
    <div className='relative rounded-lg overflow-hidden'>
      {loading && (
        <Skeleton
          className={cn(
            `rounded-lg`,
            size === 'sm' && 'w-[175px] h-[255px]',
            size === 'md' && 'w-[250px] h-[364px]',
            size === 'lg' && 'w-[325px] h-[473px]',
          )}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={100}
        priority
        onLoad={handleLoadingComplete}
        sizes={`(min-width: 640px) ${width}px, 100vw`}
        style={{
          display: loading ? 'none' : 'block',
        }}
        className={cn(
          className,
          `overflow-hidden`,
          onClick && 'transition cursor-pointer hover:opacity-50',
        )}
        onClick={onClick}
      />
    </div>
  );
}
