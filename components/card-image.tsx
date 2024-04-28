import Image from 'next/image';

interface CardImageProps {
  src: string;
  alt: string;
  width: number;
}

export function CardImage({ src, alt, width }: CardImageProps) {
  // Calculate height based on the aspect ratio of 5:7
  const height = (width / 5) * 7;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={100}
      priority
      sizes={`(min-width: 640px) ${width}px, 100vw`}
      style={{
        width: 'auto', // Ensures the width can adjust to maintain aspect ratio if height changes
        height: 'auto', // Ensures the height can adjust to maintain aspect ratio if width changes
      }}
    />
  );
}
