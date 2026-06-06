import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ChevronLeft, Pencil, LayoutGrid, Users, 
  DollarSign, CheckCircle2, Image as ImageIcon, Info
} from "lucide-react";
import axiosClient from "@/services/axiosClient";
import { Room } from "@/services/api";
import { AxiosResponse } from "axios";

// Cấu hình hiển thị Badge trạng thái đồng bộ với hệ thống Admin
const statusConfig = {
  AVAILABLE: { label: "Available", className: "bg-green-50 text-green-700 border-green-200" },
  BOOKED: { label: "Booked", className: "bg-blue-50 text-blue-700 border-blue-200" },
};

const RoomDetail = () => {
  const { shopId, roomId } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. FETCH ROOM DETAIL FROM API
  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get<Room>(`/shops/${shopId}/rooms/${roomId}`);
        
        // Sửa lỗi ép kiểu TypeScript bằng cách kiểm tra dữ liệu trả về thực tế
        const roomData = (res as AxiosResponse<Room>).data || (res as unknown as Room);
        setRoom(roomData);
      } catch (error) {
        toast.error("Failed to load room details");
        navigate(`/admin/shops/${shopId}/rooms`);
      } finally {
        setLoading(false);
      }
    };

    if (shopId && roomId) {
      fetchRoomDetail();
    }
  }, [shopId, roomId, navigate]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-slate-50/50">
        <p className="text-slate-500 font-medium">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-slate-50/50 gap-4">
        <p className="text-slate-500 font-medium">Room not found.</p>
        <Button onClick={() => navigate(`/admin/shops/${shopId}/rooms`)}>Back to Room List</Button>
      </div>
    );
  }

  const config = statusConfig[room.status as keyof typeof statusConfig] || statusConfig.AVAILABLE;

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* NÚT QUAY LẠI TRANG DANH SÁCH */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/admin/shops/${shopId}/rooms`)} 
          className="mb-6 -ml-2 text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="mr-1 h-5 w-5" /> Back to Room List
        </Button>

        {/* CONTAINER CHÍNH (Đồng bộ cấu hình border, rounded-[24px] từ RoomForm) */}
        <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
          
          {/* HEADER TRANG CHI TIẾT */}
          <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Room Details</h1>
              <p className="text-slate-500 text-sm">Viewing comprehensive data for this specific room.</p>
            </div>
            <Button 
              onClick={() => navigate(`/admin/shops/${shopId}/rooms/edit/${room.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-5 rounded-xl shadow-lg shadow-blue-100 flex items-center gap-2 self-start sm:self-auto"
            >
              <Pencil size={16} /> Edit Room Info
            </Button>
          </div>

          {/* NỘI DUNG CHIA BIỂU DIỄN 2 CỘT GRID GAP-10 GIỐNG ROOMFORM */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* CỘT TRÁI (LEFT COLUMN): THÔNG TIN PHÒNG & HÌNH ẢNH */}
            <div className="space-y-6">
              {/* Tên phòng */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-slate-700"><LayoutGrid size={16}/> Room Name</Label>
                <div className="w-full border border-slate-200 rounded-xl h-11 px-4 bg-slate-50/50 flex items-center font-medium text-slate-800">
                  {room.name}
                </div>
              </div>
              
              {/* Sức chứa và Giá cả */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold text-slate-700"><Users size={16}/> Capacity</Label>
                  <div className="w-full border border-slate-200 rounded-xl h-11 px-4 bg-slate-50/50 flex items-center text-slate-700">
                    {room.capacity}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold text-slate-700"><DollarSign size={16}/> Price / Hour</Label>
                  <div className="w-full border border-slate-200 rounded-xl h-11 px-4 bg-slate-50/50 flex items-center font-semibold text-slate-800">
                    {room.pricePerHour?.toLocaleString()}$
                  </div>
                </div>
              </div>

              {/* Hình ảnh phòng hiển thị lớn chuẩn tỷ lệ hình của Form */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-slate-700"><ImageIcon size={16}/> Room Image</Label>
                <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50 min-h-[220px] flex items-center justify-center overflow-hidden">
                  {room.imageUrl ? (
                    <img src={room.imageUrl} alt={room.name} className="w-full h-[200px] object-cover rounded-xl shadow-sm" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                      <ImageIcon className="h-10 w-10 text-slate-300 mb-2" />
                      <span className="text-xs font-medium">No image uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (RIGHT COLUMN): TIỆN ÍCH TIỂU CHUẨN & TRẠNG THÁI */}
            <div className="space-y-6">
              {/* Khung hiển thị danh sách tiện ích (Amenities) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-slate-700">
                  <CheckCircle2 size={16}/> Amenities
                </Label>
                <div className="flex flex-wrap gap-2 p-5 bg-slate-50 border border-slate-200 rounded-2xl min-h-[235px] align-content-start">
                  {room.amenities && room.amenities.length > 0 ? (
                    room.amenities.map((item) => (
                      <div 
                        key={item} 
                        className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-3.5 py-2 rounded-xl h-fit text-sm text-slate-700 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {item}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No amenities registered for this room.</span>
                  )}
                </div>
              </div>

              {/* Khung trạng thái hệ thống */}
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 flex items-center gap-2">
                  <Info size={16} /> Room Status
                </Label>
                <div className="w-full border border-slate-200 rounded-xl h-11 px-4 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${config.className}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            </div>
            
          </div>

          {/* FOOTER (Đồng bộ nút bấm với phần dưới Form) */}
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
            <Button 
              type="button" 
              onClick={() => navigate(`/admin/shops/${shopId}/rooms`)} 
              className="w-full sm:w-48 h-12 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-all shadow-md"
            >
              Close Details
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetail;