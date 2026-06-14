'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface Props {
  images: string[];
  title: string;
}

export function Gallery({ images, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = images.length > 0 ? images : [undefined];

  const open = (i: number) => setLightbox(i);
  const close = useCallback(() => setLightbox(null), []);

  return (
    <>
      <GalleryMosaic photos={photos} title={title} onOpen={open} />
      {lightbox !== null && (
        <Lightbox
          photos={photos}
          title={title}
          index={lightbox}
          setIndex={setLightbox}
          onClose={close}
        />
      )}
    </>
  );
}

function GalleryMosaic({
  photos,
  title,
  onOpen,
}: {
  photos: (string | undefined)[];
  title: string;
  onOpen: (i: number) => void;
}) {
  const total = photos.length;
  const thumbs = photos.slice(1, 5);

  return (
    <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-card bg-cream sm:aspect-auto"
        aria-label={`Ver fotos de ${title}`}
      >
        <ImageWithFallback
          src={photos[0]}
          alt={`${title} — foto principal`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </button>

      {thumbs.map((img, i) => {
        const isLast = i === thumbs.length - 1;
        const realIndex = i + 1;
        return (
          <button
            type="button"
            key={realIndex}
            onClick={() => onOpen(realIndex)}
            className="relative hidden aspect-[4/3] overflow-hidden rounded-card bg-cream sm:block"
            aria-label={`Ver foto ${realIndex + 1} de ${title}`}
          >
            <ImageWithFallback
              src={img}
              alt={`${title} — foto ${realIndex + 1}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
            {isLast && total > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-forest/55 text-sm font-semibold text-white">
                <Images className="mr-2 h-5 w-5" />
                Ver todas las fotos ({total})
              </span>
            )}
          </button>
        );
      })}

      {/* Mobile "ver todas" button */}
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="btn-outline mt-1 w-full sm:hidden"
      >
        <Images className="h-4 w-4" />
        Ver todas las fotos ({total})
      </button>
    </div>
  );
}

function Lightbox({
  photos,
  title,
  index,
  setIndex,
  onClose,
}: {
  photos: (string | undefined)[];
  title: string;
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const total = photos.length;
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(
    () => setIndex((index - 1 + total) % total),
    [index, total, setIndex],
  );
  const next = useCallback(() => setIndex((index + 1) % total), [index, total, setIndex]);

  // Keyboard handling + focus trap + scroll lock.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Tab') {
        // Simple focus trap: keep focus inside the dialog.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = original;
      previouslyFocused?.focus();
    };
  }, [onClose, prev, next]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de fotos de ${title}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 outline-none"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
        touchStartX.current = null;
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-medium tabular-nums">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar galería"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main image */}
      <div className="relative flex flex-1 items-center justify-center px-2 sm:px-16">
        <button
          type="button"
          onClick={prev}
          aria-label="Foto anterior"
          className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <div className="relative h-full max-h-[70vh] w-full max-w-4xl">
          <ImageWithFallback
            key={index}
            src={photos[index]}
            alt={`${title} — foto ${index + 1} de ${total}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Foto siguiente"
          className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4">
        {photos.map((img, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir a la foto ${i + 1}`}
            aria-current={i === index}
            className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md ${
              i === index ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <ImageWithFallback
              src={img}
              alt={`${title} — miniatura ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
