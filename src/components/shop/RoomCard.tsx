import { Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Room } from "@/services/api";
import { useBooking } from "@/context/BookingContext";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  room: Room & { fullyBooked?: boolean }; // Thêm type bổ trợ nếu type Room cũ chưa định nghĩa trường này
  shopId: string;
  shopName: string;
}

interface Amenity {
  id?: number | string;
  name: string;
}

const RoomCard = ({ room, shopId, shopName }: RoomCardProps) => {
  const { dispatch } = useBooking();
  const navigate = useNavigate();

  // 🟢 ĐÃ SỬA: Đổi từ room.isFullyBooked sang room.fullyBooked để khớp đúng data JSON
  const isAvailable = !room.fullyBooked;

  const handleBook = () => {
    if (!isAvailable) return; // Bảo vệ đề phòng click cố
    dispatch({ type: "SET_ROOM", payload: room });
    dispatch({ type: "SET_SHOP", payload: { shopId, shopName } });
    navigate(`/booking?shopId=${shopId}&roomId=${room.id}`);
  };

  return (
    <div 
      className={`flex gap-4 p-4 rounded-2xl border border-border transition-all ${
        isAvailable 
          ? "hover:border-primary/50 hover:shadow-card bg-background" 
          : "opacity-60 bg-muted/30 select-none pointer-events-none" // Khóa luôn tương tác card khi full lịch 2 ngày
      }`}
    >
      {/* Image */}
      <div className="w-28 h-28 sm:w-36 sm:h-28 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{room.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{room.capacity} people</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-foreground">
              ${room.pricePerHour}
            </p>
            <p className="text-xs text-muted-foreground">per hour</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {room.amenities && room.amenities.slice(0, 3).map((a, index) => (
            <span 
              key={index} 
              className="text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
            >
              {typeof a === 'object' && a !== null ? (a as Amenity).name : a}
            </span>
          ))}
          {room.amenities && room.amenities.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{room.amenities.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Availability + Book */}
      <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
        <div className={`flex items-center gap-1 text-xs font-semibold ${
          isAvailable ? "text-emerald-600" : "text-destructive"
        }`}>
          {isAvailable ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Available
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" />
              Booked 
            </>
          )}
        </div>
        
        <Button
          size="sm"
          disabled={!isAvailable} // Vô hiệu hóa nút bấm hoàn toàn
          onClick={handleBook}
          className={`text-xs font-bold rounded-xl px-4 py-2 transition-all ${
            isAvailable 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isAvailable ? "Book Room" : "Book Room"}
        </Button>
      </div>
    </div>
  );
};

export default RoomCard;