import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, Music } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import BookingForm from "@/components/booking/BookingForm";
import { Button } from "@/components/ui/button";
import axiosClient from "@/services/axiosClient";
import { Room } from "@/services/api";

const Booking = () => {
  const { state, dispatch, totalPrice } = useBooking();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  
  // Đọc tham số shopId và roomId từ thanh URL định danh
  const [searchParams] = useSearchParams();
  const shopIdFromUrl = searchParams.get("shopId");
  const roomIdFromUrl = searchParams.get("roomId");

  const [pageLoading, setPageLoading] = useState(false);

  // 1. Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (!authState.isAuthenticated) {
      // Giữ nguyên trang redirect kèm query params để login xong quay lại đúng phòng
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [authState.isAuthenticated, navigate]);

  // 2. Xử lý phục hồi dữ liệu từ API Backend khi người dùng nhấn F5/Refresh trang
  useEffect(() => {
    const restoreRoomState = async () => {
      // Nếu Context bị mất dữ liệu phòng nhưng trên URL vẫn giữ định danh ID
      if (!state.selectedRoom && shopIdFromUrl && roomIdFromUrl) {
        try {
          setPageLoading(true);
          
          // Gọi API Backend lấy lại chi tiết thông tin Room chuẩn cấu trúc phân cấp
          const res = await axiosClient.get<Room>(`/shops/${shopIdFromUrl}/rooms/${roomIdFromUrl}`);
          const roomData = res.data;

          if (roomData) {
            // Đồng bộ ngược dữ liệu vừa lấy từ API đắp lại vào Context lưu trữ
            dispatch({ type: "SET_ROOM", payload: roomData });
            // Bạn có thể fetch thêm chi tiết Shop để lấy shopName nếu cần, tạm thời set id làm tên hiển thị
            dispatch({ type: "SET_SHOP", payload: { shopId: shopIdFromUrl, shopName: `Shop #${shopIdFromUrl}` } });
          }
        } catch (error) {
          console.error("Failed to restore booking room information:", error);
        } finally {
          setPageLoading(false);
        }
      }
    };

    restoreRoomState();
  }, [state.selectedRoom, shopIdFromUrl, roomIdFromUrl, dispatch]);

  // Hiển thị trạng thái loading khi đang kéo lại dữ liệu từ Backend
  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground text-sm">Restoring your booking selection...</p>
      </div>
    );
  }

  // Khóa giao diện an toàn nếu hoàn toàn không có ID phòng nào được chỉ định
  if (!state.selectedRoom) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🎤</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">No room selected</h2>
        <p className="text-muted-foreground mb-6">Please browse our venues and select a room first.</p>
        <Button onClick={() => navigate("/shops")}>Browse Venues</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to venue
      </button>

      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Confirm your booking</h1>
      <p className="text-muted-foreground mb-10">Review your selection and choose your schedule.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Room Summary */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your selection</h2>

          {/* Room card */}
          <div className="bg-surface rounded-2xl overflow-hidden border border-border mb-6">
            <div className="aspect-[16/7] overflow-hidden">
              <img
                src={state.selectedRoom.imageUrl}
                alt={state.selectedRoom.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{state.shopName}</p>
              <h3 className="text-xl font-bold text-foreground mb-1">{state.selectedRoom.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Capacity: {state.selectedRoom.capacity} people
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Included amenities</h3>
            <div className="flex flex-wrap gap-2">
              {state.selectedRoom.amenities && state.selectedRoom.amenities.map((a, index) => {
                // Đảm bảo an toàn hiển thị chuỗi text sạch nếu Backend trả về mảng Object thực thể Amenity
                const amenityName = typeof a === 'object' && a !== null ? (a as { name: string }).name : a;
                return (
                  <span key={index} className="flex items-center gap-1.5 text-xs font-medium bg-background border border-border px-3 py-1.5 rounded-full">
                    <Music className="w-3 h-3 text-primary" />
                    {amenityName}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Price summary card */}
          <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Price breakdown</h3>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${state.selectedRoom.pricePerHour}/hr × {state.hours} hrs</span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Service fee</span>
              <span>$0</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
            {state.date && (
              <div className="pt-2 space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {new Date(state.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {state.startTime} — {(parseInt(state.startTime.split(":")[0]) + state.hours).toString().padStart(2, "0")}:00
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking Form */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Choose your schedule</h2>
          <div className="bg-background border border-border rounded-2xl p-5">
            <BookingForm />
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Need help? <Link to="/" className="text-primary hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;