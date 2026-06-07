import { useState, useEffect } from "react";
import { Search, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchActiveCities, fetchRoomCapacities } from "@/services/api"; // 🌟 Import hàm API thật

interface SearchBarProps {
  variant?: "hero" | "inline";
  initialQuery?: string;
  initialLocation?: string;
  initialCapacity?: string;
}

// Bộ tự điển để ánh xạ từ giá trị string trong DB ra nhãn hiển thị trực quan trên FE
const CAPACITY_LABELS: Record<string, string> = {
  small: "2–4 people",
  medium: "5–8 people",
  large: "10+ (VIP)",
};

const SearchBar = ({ 
  variant = "hero", 
  initialQuery = "", 
  initialLocation = "all",
  initialCapacity = "all"
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [capacity, setCapacity] = useState(initialCapacity); // 🌟 State quản lý sức chứa phòng thật
  
  // Các state để lưu danh sách động lấy về từ Backend
  const [cities, setCities] = useState<string[]>([]);
  const [capacities, setCapacities] = useState<string[]>([]);
  const navigate = useNavigate();

  // 🌟 Gọi API lấy dữ liệu thực tế từ DB khi component hiển thị
  useEffect(() => {
    const loadSearchUtilities = async () => {
      try {
        const [citiesData, capacitiesData] = await Promise.all([
          fetchActiveCities(),
          fetchRoomCapacities()
        ]);
        setCities(citiesData);
        setCapacities(capacitiesData);
      } catch (error) {
        console.error("Failed to load search utilities from backend:", error);
      }
    };
    loadSearchUtilities();
  }, []);

  // Xử lý gửi các tham số tìm kiếm lên URL (Chuẩn hóa tên param đồng bộ với API)
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("name", query.trim());
    if (location !== "all") params.set("city", location);
    if (capacity !== "all") params.set("capacity", capacity); // 🌟 Thêm param capacity
    
    navigate(`/shops?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // ─── 1. GIAO DIỆN INLINE (HIỂN THỊ TRÊN HEADER / TRANG KẾT QUẢ) ─────────────────
  if (variant === "inline") {
    return (
      <div className="bg-background border-b border-border py-3 px-4 flex gap-3 items-center flex-wrap sm:flex-nowrap">
        {/* Input Tìm tên */}
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
        
        {/* Select Thành phố */}
        <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-sm bg-transparent focus:outline-none text-foreground font-medium cursor-pointer"
          >
            <option value="all">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        <Button size="sm" onClick={handleSearch} className="flex-shrink-0">
          Search
        </Button>
      </div>
    );
  }

  // ─── 2. GIAO DIỆN HERO (HIỂN THỊ GIỮA BANNER TRANG CHỦ) ────────────────────────
  return (
    <div className="max-w-3xl w-full bg-background card-shadow rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2 mx-4">
      {/* Cột 1: Chọn Location (Thành phố từ DB) */}
      <div className="flex items-center gap-3 px-4 py-2 sm:border-r border-border flex-1">
        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="field-label text-xs text-muted-foreground mb-0.5">Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-foreground font-medium cursor-pointer"
          >
            <option value="all">Any city</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cột 2: Nhập Tên Quán */}
      <div className="flex items-center gap-3 px-4 py-2 sm:border-r border-border flex-1">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="field-label text-xs text-muted-foreground mb-0.5">Venue or shop name</p>
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

      {/* Cột 3: Chọn Sức Chứa (Capacity từ DB) */}
      <div className="flex items-center gap-3 px-4 py-2 flex-1">
        <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="field-label text-xs text-muted-foreground mb-0.5">Group size</p>
          <select 
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-foreground font-medium cursor-pointer"
          >
            <option value="all">Any size</option>
            {capacities.map((cap) => (
              <option key={cap} value={cap}>
                {CAPACITY_LABELS[cap] || cap}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nút Tìm Kiếm */}
      <Button onClick={handleSearch} className="sm:self-center mx-1 my-1 px-6 flex-shrink-0">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;