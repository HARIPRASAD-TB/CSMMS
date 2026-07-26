"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  alt?: string;
  className?: string;
  height?: string;
}

export function ImageSlider({
  images,
  alt = "Gallery",
  className = "",
  height = "h-56",
}: ImageSliderProps) {
  const [index, setIndex] = useState(0);
  const list = images.filter(Boolean);

  if (!list.length) {
    return (
      <div
        className={`w-full ${height} flex items-center justify-center rounded-lg bg-surface-light text-zinc-500 ${className}`}
      >
        No images
      </div>
    );
  }

  const prev = () => setIndex((i) => (i === 0 ? list.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === list.length - 1 ? 0 : i + 1));

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg ${height} ${className}`}
    >
      <Image
        src={list[index]}
        alt={`${alt} ${index + 1}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        unoptimized
      />
      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-accent" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
