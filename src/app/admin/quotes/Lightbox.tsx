"use client";
import { useEffect } from "react";

type Props = {
  photos: string[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
};

export default function Lightbox({ photos, index, onClose, onNav }: Props) {
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft"  && hasPrev) onNav(index - 1);
      if (e.key === "ArrowRight" && hasNext) onNav(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, hasPrev, hasNext, onClose, onNav]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      {/* Counter */}
      <div className="absolute top-4 left-0 right-0 text-center text-white/70 text-sm font-medium select-none pointer-events-none">
        {index + 1} of {photos.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors"
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(index - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl flex items-center justify-center transition-colors"
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(index + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl flex items-center justify-center transition-colors"
          aria-label="Next photo"
        >
          ›
        </button>
      )}

      {/* Image — stopPropagation so clicking the photo doesn't close */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[index]}
          alt={`Photo ${index + 1} of ${photos.length}`}
          className="max-w-[88vw] max-h-[82vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
