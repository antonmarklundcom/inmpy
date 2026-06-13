"use client";

import Image from "next/image";
import { useState } from "react";
import { Home } from "lucide-react";

interface Props {
  src?: string | null;
  alt: string;
  /** Use fill layout (parent must be position:relative). */
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** When true, the image is lazy-loaded (default). */
  lazy?: boolean;
}

/**
 * Renders /images/<src>, falling back to a tasteful gray placeholder with a
 * house glyph when the file is missing or fails to load. The site must look
 * intentional — never broken — when photos aren't present yet, so EVERY photo
 * routes through this component.
 */
export function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className = "",
  priority = false,
  lazy = true,
}: Props) {
  const [failed, setFailed] = useState(false);
  const resolved = src ? `/images/${src}` : null;
  const showFallback = !resolved || failed;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#efeae0] to-[#e3ddd0] ${
          fill ? "absolute inset-0 h-full w-full" : ""
        } ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
        role="img"
        aria-label={alt}
      >
        <Home className="h-1/4 max-h-12 min-h-8 w-auto text-[#bdb6a6]" aria-hidden />
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
      priority={priority}
      loading={priority ? undefined : lazy ? "lazy" : "eager"}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
