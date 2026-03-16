import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
};

const RatingStars = ({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: RatingStarsProps) => {
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
          >
            <Star
              className={`${starSize} transition-colors ${
                filled
                  ? "fill-gold text-gold"
                  : partial
                  ? "fill-gold/50 text-gold"
                  : "fill-muted text-muted-foreground/30"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
