import { Mountain } from 'lucide-react';
import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  titleFallback: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  titleFallback,
  className = 'w-full h-full object-cover',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EFECE6] via-[#E5E0D5] to-[#D8D1C3] text-[#4B4F4A] p-6 text-center"
      >
        <Mountain className="w-7 h-7 text-[#9C6C15]" aria-hidden="true" />
        <span className="font-display text-lg font-semibold text-[#1A1D1B]">
          {titleFallback}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
