import shop1Img from "@/assets/shop-1.jpg";
import shop2Img from "@/assets/shop-2.jpg";
import shop3Img from "@/assets/shop-3.jpg";
import roomBlueImg from "@/assets/room-blue.jpg";
import roomVipImg from "@/assets/room-vip.jpg";
import roomCozyImg from "@/assets/room-cozy.jpg";
import roomGallery1Img from "@/assets/room-gallery-1.jpg";

import axiosClient from "./axiosClient"; 

// ─── TYPES (ĐỒNG BỘ 100% VỚI BACKEND DTO) ──────────────────────────────────

export interface Shop {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  reviewCount: number;
  minPricePerHour: number;
  imageUrl: string;
  labels: string[];
  amenities: string[];
  description: string;
  openingHours: string;
  phoneNumber: string;
}

export interface Room {
  id: string;
  shopId: string;
  name: string;
  capacity: string;
  pricePerHour: number;
  imageUrl: string;
  status: string; 
  amenities: string[];
}

// Kiểu dữ liệu Đơn đặt phòng nhận về từ Backend (BookingResDto)
export interface Booking {
  userEmail: string;
  userName: string;
  shopId?: number | string;
  shopName?: string;
  id: string;
  roomId: string;
  roomName: string;
  bookingDate: string;
  startTime: string;
  duration: number;
  pricePerHour: number;
  serviceFee: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

// 🌟 THÊM ĐỊNH NGHĨA REQUEST DTO ĐỂ KHỚP VỚI BACKEND SPRING BOOT
export interface BookingReqDto {
  roomId: number | string;
  bookingDate: string;
  startTime: string;
  duration: number;
  serviceFee: number;
}

export interface Review {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const updateProfile = async (
  name: string,
  phoneNumber: string,
  avatarBase64: string | null
): Promise<unknown> => {
  // Gửi JSON thông thường cực kỳ gọn nhẹ
  const res = await axiosClient.put<unknown>("/users/profile", {
    name,
    phoneNumber,
    avatar: avatarBase64
  });
  return res.data;
};

// ─── API FUNCTIONS ────────────────────────────────────────────────────────────

export const fetchShops = async (params?: {
  query?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}): Promise<Shop[]> => {
  const res = await axiosClient.get<Shop[]>("/shops", { params });
  return res.data;
};

export const fetchShopById = async (id: string): Promise<Shop | null> => {
  const res = await axiosClient.get<Shop>(`/shops/${id}`);
  return res.data || null;
};

export const fetchRoomsByShop = async (shopId: string): Promise<Room[]> => {
  const res = await axiosClient.get<Room[]>(`/shops/${shopId}/rooms`);
  return res.data || [];
};

// 🌟 SỬA ĐỔI KIỂU DỮ LIỆU ĐẦU VÀO THÀNH BookingReqDto
export const createBooking = async (data: BookingReqDto): Promise<Booking> => {
  const res = await axiosClient.post<Booking>("/bookings", data);
  return res.data;
};

// Sửa lại endpoint /history khớp với Backend Controller của bạn
export const fetchUserBookings = async (): Promise<Booking[]> => {
  const res = await axiosClient.get<Booking[]>("/bookings/history");
  return res.data || [];
};

export const cancelBooking = async (id: string): Promise<void> => {
  await axiosClient.put(`/bookings/${id}/cancel`);
};

export const fetchReviews = async (shopId: string): Promise<Review[]> => {
  const res = await axiosClient.get<Review[]>(`/shops/${shopId}/reviews`);
  return res.data || [];
};

export const createReview = async (data: Omit<Review, "id" | "createdAt">): Promise<Review> => {
  const res = await axiosClient.post<Review>("/reviews", data);
  return res.data;
};

export const getFeaturedShops = async (): Promise<Shop[]> => {
  const res = await axiosClient.get<Shop[]>("/shops/featured");
  return res.data || [];
};


// Booking for admin

// 1. Lấy toàn bộ danh sách đơn đặt phòng hệ thống dành cho Admin
export const fetchAllBookings = async (): Promise<Booking[]> => {
  const res = await axiosClient.get<Booking[]>("/bookings");
  return res.data || [];
};

// 2. Admin duyệt đơn phòng (Chuyển trạng thái từ PENDING -> CONFIRMED)
export const approveBooking = async (id: number | string): Promise<Booking> => {
  const res = await axiosClient.put<Booking>(`/bookings/${id}/approve`);
  return res.data;
};

// 3. Admin từ chối duyệt hoặc Hủy đơn (Chuyển trạng thái sang CANCELLED)
export const rejectBooking = async (id: number | string): Promise<Booking> => {
  const res = await axiosClient.put<Booking>(`/bookings/${id}/cancel`);
  return res.data;
};