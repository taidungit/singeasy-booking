import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import ShopCard from "@/components/shop/ShopCard";
import SearchBar from "@/components/booking/SearchBar";
import axiosClient from "@/services/axiosClient"; // Sử dụng client đã cấu hình
import type { Shop } from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SkeletonCard = () => (
  <div className="flex flex-col gap-3">
    <div className="skeleton aspect-[4/3] rounded-2xl animate-pulse bg-slate-200" />
    <div className="skeleton h-4 w-2/3 rounded animate-pulse bg-slate-200" />
    <div className="skeleton h-3 w-1/2 rounded animate-pulse bg-slate-200" />
  </div>
);

// Cập nhật khoảng giá VNĐ phù hợp với thị trường Karaoke Việt Nam
const PRICE_RANGES = [
  { label: "Any price", min: 0, max: 9999999 },
  { label: "Under 150k/hr", min: 0, max: 150000 },
  { label: "150k – 300k/hr", min: 150000, max: 300000 },
  { label: "Above 300k/hr", min: 300000, max: 9999999 },
];

const ShopList = () => {
  const [searchParams] = useSearchParams();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");

  const query = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "all";

  const loadShops = useCallback(async () => {
    setIsLoading(true);
    try {
      const range = PRICE_RANGES[priceRange];
      
      // Kết nối API thực tế từ Backend
      const response = await axiosClient.get("/shops", {
        params: {
          name: query || undefined,
          address: location !== "all" ? location : undefined,
          minRating: minRating || undefined,
          minPrice: range.min > 0 ? range.min : undefined,
          maxPrice: range.max < 9999999 ? range.max : undefined,
        }
      });

      let results = Array.isArray(response.data) ? response.data : [];

      // Logic sắp xếp tại Client
      if (sortBy === "rating") results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      if (sortBy === "price_asc") results = [...results].sort((a, b) => a.minPricePerHour - b.minPricePerHour);
      if (sortBy === "price_desc") results = [...results].sort((a, b) => b.minPricePerHour - a.minPricePerHour);
      
      setShops(results);
    } catch (error) {
      console.error("Fetch shops error:", error);
      toast.error("Failed to load shops from server");
    } finally {
      setIsLoading(false);
    }
  }, [query, location, minRating, priceRange, sortBy]);

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky search + filter bar */}
      <div className="sticky top-16 z-30 bg-background border-b border-border shadow-sm">
        <SearchBar variant="inline" initialQuery={query} initialLocation={location} />
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs font-semibold border border-border rounded-full px-4 py-2 bg-background focus:outline-none hover:bg-accent transition-colors"
          >
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low–High</option>
            <option value="price_desc">Price: High–Low</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="text-xs font-semibold border border-border rounded-full px-4 py-2 bg-background focus:outline-none hover:bg-accent transition-colors"
          >
            {PRICE_RANGES.map((r, i) => (
              <option key={r.label} value={i}>{r.label}</option>
            ))}
          </select>

          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="text-xs font-semibold border border-border rounded-full px-4 py-2 bg-background focus:outline-none hover:bg-accent transition-colors"
          >
            <option value={0}>Any rating</option>
            <option value={4}>4+ stars</option>
            <option value={4.5}>4.5+ stars</option>
          </select>

          {(minRating > 0 || priceRange > 0) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 gap-1 text-destructive hover:bg-destructive/10"
              onClick={() => { setMinRating(0); setPriceRange(0); }}
            >
              <X className="w-3 h-3" /> Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {isLoading ? "Searching..." : `${shops.length} venue${shops.length !== 1 ? "s" : ""} found`}
            {location !== "all" && !isLoading && (
              <span className="font-normal text-muted-foreground"> in {location}</span>
            )}
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-accent/20 rounded-3xl border-2 border-dashed">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-foreground mb-2">No venues found</h2>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopList;