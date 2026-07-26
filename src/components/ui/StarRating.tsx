import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5 text-accent">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-accent" : "opacity-30"}
        />
      ))}
      <span className="ml-1 text-sm text-zinc-400">({rating})</span>
    </div>
  );
}
