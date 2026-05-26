import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import type { Shop } from "@/services/api";

interface ShopCardProps {
  shop: Shop;
  variant?: "default" | "compact";
}

const ShopCard = ({ shop, variant = "default" }: ShopCardProps) => {
  return (
    <Link to={`/shops/${shop.id}`} className="group flex flex-col gap-3">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <img
          src={shop.imageUrl}
          alt={shop.name}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        />
        {/* Rating badge */}
        {/* <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="text-yellow-500">{shop.rating}</span>
        </div> */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/10 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-yellow-400 font-bold">{shop.rating}</span>
        </div>
        {/* Tags */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {shop.labels.slice(0, 2).map((tag) => (
            <span key={tag} className="bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground leading-tight truncate">{shop.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {shop.city}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-muted-foreground">from</p>
            <p className="font-semibold text-foreground">
              ${shop.minPricePerHour}<span className="text-xs font-normal text-muted-foreground">/hr</span>
            </p>
          </div>
        </div>
        {variant === "default" && (
          <p className="text-xs text-muted-foreground mt-1">{shop.reviewCount} reviews</p>
        )}
      </div>
    </Link>
  );
};

export default ShopCard;
