import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserBookings, cancelBooking } from "@/services/api";
import type { Booking } from "@/services/api";
import { Button } from "@/components/ui/button";

// 1. Đồng bộ cấu hình giao diện theo Enum in hoa từ Spring Boot Backend
const statusConfig = {
  CONFIRMED: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  CANCELLED: { label: "Cancelled", cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

const BookingCard = ({ booking, onCancel }: { booking: Booking; onCancel: (id: number | string) => void }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  
  // 🌟 Lấy ngày hôm nay định dạng YYYY-MM-DD để tính toán chính xác tuyệt đối, không bị lệch múi giờ
  const todayStr = new Date().toISOString().split("T")[0];
  
  // 🌟 Đơn phòng được tính là quá khứ (isPast = true) nếu ngày đặt nhỏ hơn ngày hôm nay
  const isPast = booking.bookingDate < todayStr;
  const cfg = statusConfig[booking.status] || statusConfig.PENDING;

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setIsCancelling(true);
    try {
      // Gọi API hủy phòng dưới Backend
      await cancelBooking(booking.id);
      // Gọi callback để update UI ngay lập tức
      onCancel(booking.id);
    } catch (error) {
      console.error("Cancel booking error:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  // Hàm helper xử lý hiển thị ngày đặt an toàn, tránh dính lỗi "Invalid Date" xám xịt
  const renderFormattedDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const parsedDate = new Date(dateStr + "T00:00:00");
    return isNaN(parsedDate.getTime()) 
      ? dateStr 
      : parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Hàm helper xử lý hiển thị ngày tạo hệ thống (createdAt), né lỗi Invalid Date
  const renderCreatedAtDate = (createdAtStr: string) => {
    if (!createdAtStr) return "N/A";
    const parsedDate = new Date(createdAtStr);
    return isNaN(parsedDate.getTime()) ? "Recent" : parsedDate.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-0.5 border rounded-full ${cfg.cls}`}>
              {cfg.label}
            </span>
            {isPast && booking.status !== "CANCELLED" && (
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">Completed</span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{booking.shopName || "SingEasy Venue"}</h3>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">{booking.roomName}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-blue-600">${booking.totalAmount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">total price</p>
        </div>
      </div>

      <div className="h-px bg-slate-100 my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-500 font-medium">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          {renderFormattedDate(booking.bookingDate)}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          {/* Cắt lấy HH:mm, fallback nếu trống data */}
          {booking.startTime ? booking.startTime.substring(0, 5) : "--:--"} · {booking.duration} {booking.duration === 1 ? "hour" : "hours"}
        </span>
        <span className="text-xs text-slate-400 sm:text-right flex items-center sm:justify-end">
          Booked {renderCreatedAtDate(booking.createdAt)}
        </span>
      </div>

      {/* 🌟 NÚT HỦY PHÒNG LỘ DIỆN Ở ĐÂY: Hiện nếu đơn chưa bị hủy ở Backend và chưa quá ngày đi hát */}
      {booking.status !== "CANCELLED" && !isPast && (
        <div className="mt-4 flex gap-2 border-t border-slate-50 pt-3 justify-end">
          <Link to={`/shops/${booking.shopId}`}>
            <Button variant="outline" size="sm" className="gap-1 text-xs rounded-xl h-9 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold active:scale-95 transition-transform">
              View Venue <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-9 font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl active:scale-95 transition-transform"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? <><Loader2 className="w-3 h-3 animate-spin mr-1" /> Cancelling...</> : "Cancel booking"}
          </Button>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  // Chuỗi ngày hiện tại định dạng "YYYY-MM-DD" dùng chung để đồng bộ stats và bộ lọc tab
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchUserBookings()
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Fetch bookings error:", err))
      .finally(() => setIsLoading(false));
  }, [authState.isAuthenticated, navigate]);

  const handleCancel = (id: number | string) => {
    // Cập nhật State trong RAM ngay lập tức để tab history nhảy số
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" as const } : b))
    );
  };

  // Đồng bộ bộ lọc Tab bằng cách so sánh String trực tiếp cho chính xác múi giờ
  const upcoming = bookings.filter(
    (b) => b.bookingDate >= todayStr && b.status !== "CANCELLED"
  );
  
  const history = bookings.filter(
    (b) => b.bookingDate < todayStr || b.status === "CANCELLED"
  );

  if (!authState.isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50/40 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {authState.user?.name ? authState.user.name.split(" ")[0] : "User"} 👋
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">{authState.user?.email}</p>
        </div>

        {/* Stats Card - Đã đồng bộ logic đếm số lượng dựa trên chuỗi ngày mới */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total bookings", value: bookings.length },
            { label: "Upcoming", value: upcoming.length },
            { label: "Completed", value: bookings.filter((b) => b.bookingDate < todayStr && b.status !== "CANCELLED").length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 text-center border border-slate-200/80 shadow-sm animate-fade-in-up">
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs Switcher */}
        <div className="flex border-b border-slate-200 mb-6">
          {(["upcoming", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 font-extrabold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "upcoming" ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 w-full bg-slate-200/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === "upcoming" ? upcoming : history).map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
            ))}
            
            {(activeTab === "upcoming" ? upcoming : history).length === 0 && (
              <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl animate-fade-in">
                <p className="text-4xl mb-3">📅</p>
                <p className="text-slate-400 text-sm font-semibold">
                  {activeTab === "upcoming"
                    ? "No upcoming bookings. Time to sing out loud!"
                    : "No booking history yet."}
                </p>
                {activeTab === "upcoming" && (
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-100" onClick={() => navigate("/shops")}>
                    Browse Venues
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;