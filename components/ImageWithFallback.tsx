'use client';

import Image from 'next/image';
import { Home } from 'lucide-react';
import { useState } from 'react';

interface Props {
  /** Filename inside /public/images, e.g. "prop1-1.jpg". */
  src: string | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Renders a photo, degrading to a tasteful gray placeholder (small house icon)
 * whenever the file is missing. This is what lets a fresh clone with zero image
 * files still look intentional rather than broken.
 */
export function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  priority,
}: Props) {
  const [errored, setErrored] = useState(false);
  const hasSrc = Boolean(src) && !errored;
  const resolved = src ? `/images/${src}` : '';

  if (!hasSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-[#ECE9E2] ${className ?? ''}`}
        style={fill ? undefined : { width, height }}
        aria-label={alt}
        role="img"
      >
        <Home className="h-1/4 max-h-12 w-1/4 max-w-12 text-[#C3BCAD]" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}
