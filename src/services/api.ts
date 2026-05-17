import shop1Img from "@/assets/shop-1.jpg";
import shop2Img from "@/assets/shop-2.jpg";
import shop3Img from "@/assets/shop-3.jpg";
import roomBlueImg from "@/assets/room-blue.jpg";
import roomVipImg from "@/assets/room-vip.jpg";
import roomCozyImg from "@/assets/room-cozy.jpg";
import roomGallery1Img from "@/assets/room-gallery-1.jpg";

import axiosClient from "./axiosClient"; // Import axiosClient của bạn vào đây

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
  status: string; // CHUYỂN HẲN SANG STRING (Bắt buộc) - XÓA BỎ available: boolean
  amenities: string[];
}

export interface Booking {
  id: string;
  shopId: string;
  shopName: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  hours: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
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

// ─── API FUNCTIONS (KẾT NỐI DATABASE QUA BACKEND THẬT) ─────────────────────────

// 1. Lấy danh sách shops từ API Spring Boot
export const fetchShops = async (params?: {
  query?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}): Promise<Shop[]> => {
  // Thay vì đọc mảng mock, gọi trực tiếp API Backend qua Axios
  const res = await axiosClient.get<Shop[]>("/shops", { params });
  return res.data;
};

// 2. Lấy chi tiết Shop theo ID
export const fetchShopById = async (id: string): Promise<Shop | null> => {
  const res = await axiosClient.get<Shop>(`/shops/${id}`);
  return res.data || null;
};

// 3. Lấy danh sách phòng của một Shop (API phân cấp chúng ta vừa sửa)
export const fetchRoomsByShop = async (shopId: string): Promise<Room[]> => {
  const res = await axiosClient.get<Room[]>(`/shops/${shopId}/rooms`);
  return res.data || [];
};

// 4. Tạo đơn đặt phòng mới
export const createBooking = async (data: Omit<Booking, "id" | "createdAt">): Promise<Booking> => {
  const res = await axiosClient.post<Booking>("/bookings", data);
  return res.data;
};

// 5. Lấy danh sách lịch sử đặt phòng của User hiện tại
export const fetchUserBookings = async (): Promise<Booking[]> => {
  const res = await axiosClient.get<Booking[]>("/bookings/my-bookings");
  return res.data || [];
};

// 6. Hủy đặt phòng
export const cancelBooking = async (id: string): Promise<void> => {
  await axiosClient.put(`/bookings/${id}/cancel`);
};

// 7. Lấy danh sách đánh giá của quán
export const fetchReviews = async (shopId: string): Promise<Review[]> => {
  const res = await axiosClient.get<Review[]>(`/shops/${shopId}/reviews`);
  return res.data || [];
};

// 8. Viết đánh giá mới
export const createReview = async (data: Omit<Review, "id" | "createdAt">): Promise<Review> => {
  const res = await axiosClient.post<Review>("/reviews", data);
  return res.data;
};

// 9. Lấy danh sách các quán nổi bật (Hiển thị ở trang chủ)
export const getFeaturedShops = async (): Promise<Shop[]> => {
  const res = await axiosClient.get<Shop[]>("/shops/featured");
  return res.data || [];
};