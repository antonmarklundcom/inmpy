"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface Props {
  images: string[];
  title: string;
}

/**
 * The per-property gallery — the centerpiece of the listing detail page.
 *
 * Desktop: a mosaic of one large hero image + a 2×2 grid of thumbnails, with a
 * "Ver todas las fotos (N)" button overlaid on the last thumbnail.
 * Any click opens a full-screen, keyboard-navigable, swipeable lightbox with a
 * thumbnail strip, a counter and a close button. Focus is trapped while open
 * and restored on close.
 */
export function Gallery({ images, title }: Props) {
  const safeImages = images.length > 0 ? images : [undefined];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const titleId = useId();

  const count = safeImages.length;

  const openAt = useCallback((i: number) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setIndex(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    lastFocused.current?.focus();
  }, []);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  // Keyboard + body scroll lock + focus trap while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab") {
        // Simple focus trap: keep focus inside the dialog.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
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
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  const thumbs = safeImages.slice(1, 5);

  return (
    <>
      {/* Mosaic */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-cream sm:aspect-auto sm:h-full sm:min-h-[320px]"
          aria-label={`Ver fotos de ${title}`}
        >
          <ImageWithFallback
            src={safeImages[0]}
            alt={`${title} — foto 1`}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </button>

        <div className="grid grid-cols-2 gap-2">
          {thumbs.map((img, i) => {
            const isLast = i === thumbs.length - 1;
            const remaining = count - 5;
            return (
              <button
                key={i}
                type="button"
                onClick={() => openAt(i + 1)}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-cream"
                aria-label={`Ver foto ${i + 2} de ${title}`}
              >
                <ImageWithFallback
                  src={img}
                  alt={`${title} — foto ${i + 2}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
                {isLast && remaining > 0 && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 text-white">
                    <ImageIcon className="h-5 w-5" aria-hidden />
                    <span className="text-sm font-medium">
                      Ver todas las fotos ({count})
                    </span>
                  </span>
                )}
              </button>
            );
          })}
          {/* Fill empty thumbnail slots so the grid stays tidy */}
          {thumbs.length < 4 &&
            Array.from({ length: 4 - thumbs.length }).map((_, i) => (
              <div
                key={`fill-${i}`}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-cream"
                aria-hidden
              >
                <ImageWithFallback src={undefined} alt="" fill />
              </div>
            ))}
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="btn-outline text-sm"
        >
          <ImageIcon className="h-4 w-4" aria-hidden />
          Ver todas las fotos ({count})
        </button>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="fixed inset-0 z-[60] flex flex-col bg-black/95 outline-none"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            if (dx > 50) prev();
            else if (dx < -50) next();
            touchStartX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span id={titleId} className="text-sm font-medium">
              {title}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm tabular-nums text-white/80" aria-live="polite">
                {index + 1} / {count}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar galería"
                className="rounded-full p-2 hover:bg-white/10"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-2 sm:px-16">
            {count > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
            )}

            <div className="relative h-full max-h-[72vh] w-full max-w-5xl">
              <ImageWithFallback
                key={index}
                src={safeImages[index]}
                alt={`${title} — foto ${index + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {count > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:right-4"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {count > 1 && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4">
              {safeImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ir a la foto ${i + 1}`}
                  aria-current={i === index}
                  className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md ${
                    i === index ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
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
          )}
        </div>
      )}
    </>
  );
}
