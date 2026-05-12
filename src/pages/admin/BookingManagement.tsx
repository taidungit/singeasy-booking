import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card"; // Giả sử bạn dùng Shadcn/ui

// 1. Định nghĩa kiểu dữ liệu cho Room
interface RoomBookingMock {
  id: number;
  roomName: string;
  status: "AVAILABLE" | "OCCUPIED" | "BOOKED";
  customerName?: string;
  startTime?: string;
  endTime?: string;
  pricePerHour: number;
}

const BookingManagement = () => {
  const [searchParams] = useSearchParams();
  const shopId = searchParams.get("shopId");
  const [rooms, setRooms] = useState<RoomBookingMock[]>([]);

  // 2. Mock Data dựa trên shopId nhận từ URL
  useEffect(() => {
    const fetchMockData = () => {
      // Giả lập logic lấy dữ liệu khác nhau cho từng Shop
      if (shopId === "1") {
        setRooms([
          { id: 101, roomName: "Phòng VIP 01", status: "OCCUPIED", customerName: "Nguyễn Tài Dũng", startTime: "19:00", endTime: "21:30", pricePerHour: 300000 },
          { id: 102, roomName: "Phòng Standard 01", status: "AVAILABLE", pricePerHour: 150000 },
          { id: 103, roomName: "Phòng VIP 02", status: "BOOKED", customerName: "Trần Minh Hoa", startTime: "21:00", endTime: "23:00", pricePerHour: 300000 },
        ]);
      } else {
        setRooms([
          { id: 201, roomName: "Phòng Galaxy A", status: "AVAILABLE", pricePerHour: 200000 },
          { id: 202, roomName: "Phòng Galaxy B", status: "OCCUPIED", customerName: "Khách vãng lai", startTime: "20:00", endTime: "22:00", pricePerHour: 200000 },
        ]);
      }
    };

    fetchMockData();
  }, [shopId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header trang */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Quản lý đặt phòng</h1>
        <p className="text-muted-foreground text-sm">
          Đang xem danh sách phòng của Shop ID: <span className="font-mono font-bold text-primary">{shopId}</span>
        </p>
      </div>

      {/* Chú thích trạng thái */}
      <div className="flex gap-6 mb-6 p-4 bg-background rounded-xl border border-border">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full" /> <span>Trống</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-red-500 rounded-full" /> <span>Đang sử dụng</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" /> <span>Đã đặt trước</span>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <Card 
            key={room.id}
            className={`p-5 border-2 transition-all cursor-pointer hover:shadow-md ${
              room.status === "OCCUPIED" ? "border-red-500/20 bg-red-50/50" :
              room.status === "BOOKED" ? "border-yellow-500/20 bg-yellow-50/50" : "border-green-500/20 bg-green-50/50"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{room.roomName}</h3>
              {room.status === "AVAILABLE" ? (
                <CheckCircle2 className="text-green-500 w-5 h-5" />
              ) : (
                <Clock className="text-muted-foreground w-5 h-5" />
              )}
            </div>

            {room.status !== "AVAILABLE" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{room.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{room.startTime} - {room.endTime}</span>
                </div>
                <button className="w-full mt-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
                   {room.status === "OCCUPIED" ? "Thanh toán" : "Check-in"}
                </button>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center">
                <p className="text-sm text-muted-foreground italic">Phòng đang trống</p>
                <button className="mt-4 px-4 py-2 border border-border rounded-lg text-xs font-bold hover:bg-white transition-all">
                  Tạo đặt phòng
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed">
          <AlertCircle className="mx-auto w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không tìm thấy dữ liệu phòng cho shop này.</p>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;