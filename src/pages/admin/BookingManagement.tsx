import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Loader2, 
  RefreshCw,
  User,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Giả lập hoặc import các hàm gọi API Admin từ file services của bạn
// Bạn nhớ khai báo các hàm này trong src/services/api.ts nhé
import { fetchAllBookings, approveBooking, rejectBooking, Booking } from "@/services/api";

interface AdminBooking {
  id: number | string;
  bookingDate: string;
  startTime: string;
  duration: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  roomName: string;
  shopName: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

const statusStyles = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  // Hàm tải danh sách toàn bộ đơn đặt phòng của hệ thống
const loadAllBookings = async () => {
  setIsLoading(true);
  try {
    const data = await fetchAllBookings(); 
    // Bây giờ cả 2 bên đều là Booking[] nên gán cực kỳ mượt mà
    setBookings(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to fetch admin bookings:", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    loadAllBookings();
  }, []);

  // Xử lý Duyệt đơn phòng (Chuyển sang CONFIRMED)
  const handleApprove = async (id: number | string) => {
    setActionLoadingId(id);
    try {
      await approveBooking(id); // API endpoint: PUT /api/v1/bookings/{id}/approve
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CONFIRMED" } : b))
      );
    } catch (error) {
      console.error("Approve booking error:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Xử lý Từ chối / Hủy đơn phòng (Chuyển sang CANCELLED)
  const handleReject = async (id: number | string) => {
    if (!confirm("Are you sure you want to reject this booking?")) return;
    setActionLoadingId(id);
    try {
      await rejectBooking(id); // API endpoint: PUT /api/v1/bookings/{id}/cancel
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
    } catch (error) {
      console.error("Reject booking error:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Logic lọc dữ liệu theo thanh tìm kiếm và bộ lọc trạng thái công việc
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesSearch = 
      (b.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (b.shopName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (b.roomName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Management</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Review, approve, and manage customer karaoke reservations.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={loadAllBookings} 
            disabled={isLoading}
            className="w-fit gap-2 font-semibold border-slate-200 rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Overview Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: bookings.length, color: "text-slate-900" },
            { label: "Pending Approval", value: bookings.filter(b => b.status === "PENDING").length, color: "text-amber-600" },
            { label: "Confirmed", value: bookings.filter(b => b.status === "CONFIRMED").length, color: "text-emerald-600" },
            { label: "Cancelled / Rejected", value: bookings.filter(b => b.status === "CANCELLED").length, color: "text-rose-600" },
          ].map((card) => (
            <div key={card.label} className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm">
              <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Thanh tìm kiếm */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, shop, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium transition-all"
            />
          </div>

          {/* Nhóm nút lọc nhanh Tab Trạng thái */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                  statusFilter === tab
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab === "ALL" ? "All Status" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Table Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-slate-400 text-sm font-medium">Loading system bookings...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Customer / Shop</th>
                    <th className="py-4 px-6">Booking Details</th>
                    <th className="py-4 px-6">Total Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Cột 1: Thông tin khách đặt và địa điểm */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{booking.userName || "Guest User"}</p>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">{booking.userEmail}</p>
                            <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1">
                              🏢 {booking.shopName || "SingEasy Venue"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Chi tiết lịch hẹn ngày giờ & phòng hát */}
                      <td className="py-4 px-6">
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            {booking.roomName}
                          </div>
                          <div className="flex flex-col gap-0.5 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {booking.bookingDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {booking.startTime?.substring(0, 5)} · {booking.duration} {booking.duration === 1 ? "hour" : "hours"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 3: Tổng số tiền phải thu */}
                      <td className="py-4 px-6">
                        <p className="text-base font-black text-slate-900">${booking.totalAmount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Settled</p>
                      </td>

                      {/* Cột 4: Huy hiệu Trạng thái */}
                      <td className="py-4 px-6">
                        <span className={`text-xs font-bold px-3 py-1 border rounded-full ${statusStyles[booking.status] || statusStyles.PENDING}`}>
                          {booking.status}
                        </span>
                      </td>

                      {/* Cột 5: Cụm nút thao tác xử lý Duyệt/Từ chối */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          {booking.status === "PENDING" ? (
                            <>
                              {/* Nút Duyệt phòng (Approve) */}
                              <Button
                                size="sm"
                                onClick={() => handleApprove(booking.id)}
                                disabled={actionLoadingId !== null}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 rounded-xl h-8 text-xs"
                              >
                                {actionLoadingId === booking.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                Approve
                              </Button>

                              {/* Nút Từ chối đơn (Reject) */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(booking.id)}
                                disabled={actionLoadingId !== null}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold gap-1 rounded-xl h-8 text-xs"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            // Nếu đơn đã ở trạng thái CONFIRMED hoặc CANCELLED thì hiện nút Hủy dự phòng nếu chưa quá ngày
                            booking.status === "CONFIRMED" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReject(booking.id)}
                                disabled={actionLoadingId !== null}
                                className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-8 font-bold"
                              >
                                Cancel Session
                              </Button>
                            )
                          )}
                          {booking.status === "CANCELLED" && (
                            <span className="text-xs font-semibold text-slate-400 pr-2">Archived</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400 font-semibold">
                        No reservations found matching the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;