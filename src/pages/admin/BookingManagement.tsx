import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Loader2, 
  RefreshCw,
  User,
  Layers,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

import axiosClient from "@/services/axiosClient";
import { approveBooking, rejectBooking, Booking } from "@/services/api";

const fetchBookingsByShopId = async (shopId: string): Promise<Booking[]> => {
  const res = await axiosClient.get<Booking[]>(`/bookings/shop/${shopId}`);
  return res.data || [];
};

const statusStyles = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

const BookingManagement = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  // State kiểm soát hành động click bước 1
  const [activeConfirmId, setActiveConfirmId] = useState<string | number | null>(null);

  const loadShopBookings = async () => {
    if (!shopId) return;
    setIsLoading(true);
    try {
      const data = await fetchBookingsByShopId(shopId); 
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch shop bookings:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShopBookings();
  }, [shopId]);

  // Tự động đóng trạng thái xác nhận sau 4 giây tĩnh lặng
  useEffect(() => {
    if (!activeConfirmId) return;
    const timer = setTimeout(() => setActiveConfirmId(null), 4000);
    return () => clearTimeout(timer);
  }, [activeConfirmId]);

  const handleApprove = async (id: number | string) => {
    setActiveConfirmId(null);
    setActionLoadingId(id);
    try {
      await approveBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CONFIRMED" } : b))
      );
    } catch (error) {
      console.error("Approve booking error:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleExecuteReject = async (id: number | string) => {
    setActiveConfirmId(null);
    setActionLoadingId(id);
    try {
      await rejectBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
    } catch (error) {
      console.error("Execute reject/cancel error:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesSearch = 
      (b.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (b.roomName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 font-sans min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/shops")} className="rounded-xl">
            <ChevronLeft />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Booking Management - Shop #{shopId}
          </h1>
          <Button 
            variant="outline" 
            onClick={loadShopBookings} 
            disabled={isLoading}
            className="ml-auto gap-2 font-semibold border-slate-200 rounded-xl"
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
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium transition-all"
            />
          </div>

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
            <p className="text-slate-400 text-sm font-medium">Loading shop bookings...</p>
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
                  {filteredBookings.map((booking) => {
                    const isConfirming = activeConfirmId === booking.id;

                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
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

                        <td className="py-4 px-6">
                          <p className="text-base font-black text-slate-900">${booking.totalAmount}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Settled</p>
                        </td>

                        <td className="py-4 px-6">
                          <span className={`text-xs font-bold px-3 py-1 border rounded-full ${statusStyles[booking.status] || statusStyles.PENDING}`}>
                            {booking.status}
                          </span>
                        </td>

                        {/* 🟢 KHU VỰC ACTIONS TRƯỢT 2 BƯỚC ĐÃ ĐƯỢC CHUẨN HÓA VĂN PHONG TEXT */}
                        <td className="py-4 px-6 text-right overflow-hidden">
                          <div className="flex justify-end items-center gap-2 min-h-[32px]">
                            
                            {/* TRẠNG THÁI 1: CHƯA KÍCH HOẠT XÁC NHẬN */}
                            {!isConfirming && booking.status === "PENDING" && (
                              <div className="flex items-center gap-2 transition-all duration-300 transform translate-x-0">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(booking.id)}
                                  disabled={actionLoadingId !== null}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold gap-1 rounded-xl h-8 px-3 text-xs shadow-none"
                                >
                                  {actionLoadingId === booking.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  )}
                                  Approve
                                </Button>

                                <Button
                                  size="sm"
                                  onClick={() => setActiveConfirmId(booking.id)}
                                  disabled={actionLoadingId !== null}
                                  className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold gap-1 rounded-xl h-8 px-3 text-xs shadow-none"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  Reject
                                </Button>
                              </div>
                            )}

                            {!isConfirming && booking.status === "CONFIRMED" && (
                              <Button
                                size="sm"
                                onClick={() => setActiveConfirmId(booking.id)}
                                disabled={actionLoadingId !== null}
                                className="bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 font-bold rounded-xl h-8 px-3 text-xs shadow-none transition-all duration-300 transform translate-x-0"
                              >
                                Cancel Session
                              </Button>
                            )}

                            {/* TRẠNG THÁI 2: ĐÃ CLICK BƯỚC 1 -> TRƯỢT DÒNG HỎI TINH TẾ */}
                            {isConfirming && (
                              <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-200 ease-out">
                                <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1 select-none">
                                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                                  {booking.status === "CONFIRMED" ? "Cancel session?" : "Reject request?"}
                                </span>
                                
                                {/* Nút Hủy Lệnh: Giữ lại, không xóa */}
                                <Button
                                  size="sm"
                                  onClick={() => setActiveConfirmId(null)}
                                  className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold rounded-xl h-8 px-2.5 text-xs shadow-none"
                                >
                                  No, Keep
                                </Button>

                                {/* Nút Xác Thực Hành Động Thật Sự */}
                                <Button
                                  size="sm"
                                  onClick={() => handleExecuteReject(booking.id)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl h-8 px-3 text-xs shadow-none border-none"
                                >
                                  {actionLoadingId === booking.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : booking.status === "CONFIRMED" ? (
                                    "Yes, Cancel"
                                  ) : (
                                    "Yes, Reject"
                                  )}
                                </Button>
                              </div>
                            )}

                            {booking.status === "CANCELLED" && (
                              <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                                Archived
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400 font-semibold">
                        No reservations found for this specific shop.
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