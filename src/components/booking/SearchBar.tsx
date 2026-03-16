import { useState } from "react";
import { Search, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  variant?: "hero" | "inline";
  initialQuery?: string;
  initialLocation?: string;
}

const LOCATIONS = ["all", "Tokyo", "Seoul", "Singapore", "Melbourne", "Bangkok", "New York"];

const SearchBar = ({ variant = "hero", initialQuery = "", initialLocation = "all" }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location !== "all") params.set("location", location);
    navigate(`/shops?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  if (variant === "inline") {
    return (
      <div className="bg-background border-b border-border py-3 px-4 flex gap-3 items-center flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 flex-1 min-w-0 border border-border rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search shops..."
            className="w-full text-sm bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-sm bg-transparent focus:outline-none text-foreground"
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l === "all" ? "All Cities" : l}</option>
            ))}
          </select>
        </div>
        <Button size="sm" onClick={handleSearch} className="flex-shrink-0">
          Search
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full bg-background card-shadow rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2 mx-4">
      {/* Location */}
      <div className="flex items-center gap-3 px-4 py-2 sm:border-r border-border flex-1">
        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="field-label">Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-foreground font-medium"
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l === "all" ? "Any city" : l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-2 sm:border-r border-border flex-1">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="field-label">Venue or shop name</p>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Echo Shibuya..."
            className="w-full text-sm bg-transparent focus:outline-none text-foreground font-medium placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-3 px-4 py-2 flex-1">
        <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="field-label">Group size</p>
          <select className="w-full text-sm bg-transparent focus:outline-none text-foreground font-medium">
            <option>Any size</option>
            <option>2–4 people</option>
            <option>5–8 people</option>
            <option>10+ (VIP)</option>
          </select>
        </div>
      </div>

      <Button onClick={handleSearch} className="sm:self-center mx-1 my-1 px-6">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
