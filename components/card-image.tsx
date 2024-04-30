import Image from 'next/image';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface CardImageProps {
  src: string;
  alt: string;
  width: number;
}
export function CardImage({ src, alt, width }: CardImageProps) {
  const [loading, setLoading] = useState(true);
  const height = (width / 5) * 7;

  // Event handler for image loading completion
  const handleLoadingComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <Skeleton className={`w-[250px] h-[364px] rounded-lg`} />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={100}
        priority
        onLoadingComplete={handleLoadingComplete}
        sizes={`(min-width: 640px) ${width}px, 100vw`}
        style={{
          display: loading ? 'none' : 'block',
        }}
        className='rounded-lg'
      />
    </>
  );
}
