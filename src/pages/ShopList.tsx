import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ShopCard from "@/components/shop/ShopCard";
import SearchBar from "@/components/booking/SearchBar";
import { fetchShops } from "@/services/api";
import type { Shop } from "@/services/api";
import { Button } from "@/components/ui/button";

const SkeletonCard = () => (
  <div className="flex flex-col gap-3">
    <div className="skeleton aspect-[4/3] rounded-2xl" />
    <div className="skeleton h-4 w-2/3 rounded" />
    <div className="skeleton h-3 w-1/2 rounded" />
  </div>
);

const PRICE_RANGES = [
  { label: "Any price", min: 0, max: 9999 },
  { label: "Under $20/hr", min: 0, max: 20 },
  { label: "$20–$40/hr", min: 20, max: 40 },
  { label: "$40+/hr", min: 40, max: 9999 },
];

const ShopList = () => {
  const [searchParams] = useSearchParams();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");

  const query = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "all";

  const loadShops = useCallback(async () => {
    setIsLoading(true);
    try {
      const range = PRICE_RANGES[priceRange];
      let results = await fetchShops({
        query,
        location: location !== "all" ? location : undefined,
        minRating: minRating || undefined,
        maxPrice: range.max < 9999 ? range.max : undefined,
        minPrice: range.min > 0 ? range.min : undefined,
      });
      if (sortBy === "rating") results = [...results].sort((a, b) => b.rating - a.rating);
      if (sortBy === "price_asc") results = [...results].sort((a, b) => a.priceFrom - b.priceFrom);
      if (sortBy === "price_desc") results = [...results].sort((a, b) => b.priceFrom - a.priceFrom);
      setShops(results);
    } finally {
      setIsLoading(false);
    }
  }, [query, location, minRating, priceRange, sortBy]);

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  return (
    <div>
      {/* Sticky search + filter bar */}
      <div className="sticky top-16 z-30 bg-background border-b border-border">
        <SearchBar variant="inline" initialQuery={query} initialLocation={location} />
        <div className="px-4 sm:px-6 py-2 flex items-center gap-3 overflow-x-auto">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs font-medium border border-border rounded-full px-3 py-1.5 bg-background focus:outline-none"
          >
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low–High</option>
            <option value="price_desc">Price: High–Low</option>
          </select>
          {/* Price filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="text-xs font-medium border border-border rounded-full px-3 py-1.5 bg-background focus:outline-none"
          >
            {PRICE_RANGES.map((r, i) => (
              <option key={r.label} value={i}>{r.label}</option>
            ))}
          </select>
          {/* Rating filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="text-xs font-medium border border-border rounded-full px-3 py-1.5 bg-background focus:outline-none"
          >
            <option value={0}>Any rating</option>
            <option value={4}>4+ stars</option>
            <option value={4.5}>4.5+ stars</option>
            <option value={4.8}>4.8+ stars</option>
          </select>
          {/* Clear filters */}
          {(minRating > 0 || priceRange > 0) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 gap-1"
              onClick={() => { setMinRating(0); setPriceRange(0); }}
            >
              <X className="w-3 h-3" /> Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">
            {isLoading ? "Searching..." : `${shops.length} venue${shops.length !== 1 ? "s" : ""} found`}
            {location !== "all" && !isLoading && (
              <span className="font-normal text-muted-foreground text-base"> in {location}</span>
            )}
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-semibold text-foreground mb-2">No venues found</h2>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopList;
