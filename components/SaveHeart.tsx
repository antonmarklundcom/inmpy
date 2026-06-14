'use client';

import { Heart } from 'lucide-react';
import { useSaved } from '@/lib/saved';

interface Props {
  id: string;
  /** Visual variant: floating over an image, or inline on the detail page. */
  variant?: 'overlay' | 'inline';
  className?: string;
}

export function SaveHeart({ id, variant = 'overlay', className }: Props) {
  const { saved, toggle } = useSaved(id);

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        className={`inline-flex items-center gap-2 rounded-control border px-4 py-3 text-sm font-semibold transition-colors ${
          saved
            ? 'border-clay bg-clay/10 text-clay'
            : 'border-line bg-white text-ink hover:border-clay hover:text-clay'
        } ${className ?? ''}`}
      >
        <Heart className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} />
        {saved ? 'Guardada' : 'Guardar'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-pressed={saved}
      aria-label={saved ? 'Quitar de guardados' : 'Guardar propiedad'}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform hover:scale-105 ${
        className ?? ''
      }`}
    >
      <Heart
        className={saved ? 'text-clay' : 'text-ink/70'}
        fill={saved ? 'currentColor' : 'none'}
        strokeWidth={2}
        size={18}
      />
    </button>
  );
}
