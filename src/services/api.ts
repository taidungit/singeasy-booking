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

// Định nghĩa Request DTO để khớp với Backend Spring Boot
export interface BookingReqDto {
  roomId: number | string;
  bookingDate: string;
  startTime: string;
  duration: number;
  serviceFee: number;
}

// Kiểu dữ liệu Đánh giá nhận về từ Backend (ReviewResDto)
export interface Review {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Định nghĩa Request DTO gửi lên cho Review (ReviewReqDto)
export interface ReviewReqDto {
  shopId: number | string;
  rating: number;
  comment: string;
}

// Định nghĩa Interface Filter đồng bộ chính xác với các `@Param` của Backend
export interface ShopFilters {
  name?: string;
  address?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
}

// ─── API FUNCTIONS ────────────────────────────────────────────────────────────

export const updateProfile = async (
  name: string,
  phoneNumber: string,
  avatarBase64: string | null
): Promise<unknown> => {
  const res = await axiosClient.put<unknown>("/users/profile", {
    name,
    phoneNumber,
    avatar: avatarBase64
  });
  return res.data;
};

// ─── SHOPS & ROOMS (CHIA TÁCH BIỆT THEO Ý BẠN) ────────────────────────────────

/**
 * 🔵 1. Lấy toàn bộ danh sách quán Karaoke mặc định (Không truyền bộ lọc)
 * Endpoint ở Backend: GET /api/v1/shops
 */
export const fetchShops = async (): Promise<Shop[]> => {
  const res = await axiosClient.get<Shop[]>("/shops");
  return res.data || [];
};

/**
 * 🟢 2. Tìm kiếm và lọc nâng cao chuyên biệt
 * Endpoint ở Backend: GET /api/v1/shops/search
 */
export const fetchFilteredShops = async (params: ShopFilters): Promise<Shop[]> => {
  const res = await axiosClient.get<Shop[]>("/shops/search", { params });
  return res.data || [];
};

export const fetchShopById = async (id: string): Promise<Shop | null> => {
  const res = await axiosClient.get<Shop>(`/shops/${id}`);
  return res.data || null;
};

export const fetchRoomsByShop = async (shopId: string): Promise<Room[]> => {
  const res = await axiosClient.get<Room[]>(`/shops/${shopId}/rooms`);
  return res.data || [];
};

export const getFeaturedShops = async (): Promise<Shop[]> => {
  const res = await axiosClient.get<Shop[]>("/shops/featured");
  return res.data || [];
};

// ─── BOOKINGS (USER) ──────────────────────────────────────────────────────────

export const createBooking = async (data: BookingReqDto): Promise<Booking> => {
  const res = await axiosClient.post<Booking>("/bookings", data);
  return res.data;
};

export const fetchUserBookings = async (): Promise<Booking[]> => {
  const res = await axiosClient.get<Booking[]>("/bookings/history");
  return res.data || [];
};

export const cancelBooking = async (id: string): Promise<void> => {
  await axiosClient.put(`/bookings/${id}/cancel`);
};

// ─── REVIEWS ───────────────────────

export const getReviewsByShop = async (shopId: string | number): Promise<Review[]> => {
  const res = await axiosClient.get<Review[]>(`/reviews/shop/${shopId}`);
  return res.data || [];
};

export const createReview = async (data: ReviewReqDto): Promise<Review> => {
  const res = await axiosClient.post<Review>("/reviews", data);
  return res.data;
};

// ─── BOOKINGS (ADMIN) ─────────────────────────────────────────────────────────

export const fetchAllBookings = async (): Promise<Booking[]> => {
  const res = await axiosClient.get<Booking[]>("/bookings");
  return res.data || [];
};

export const approveBooking = async (id: number | string): Promise<Booking> => {
  const res = await axiosClient.put<Booking>(`/bookings/${id}/approve`);
  return res.data;
};

export const rejectBooking = async (id: number | string): Promise<Booking> => {
  const res = await axiosClient.put<Booking>(`/bookings/${id}/cancel`);
  return res.data;
};

// ─── Search Utilities (Cities & Capacities) ──────────────────────────────────
export const fetchActiveCities = async (): Promise<string[]> => {
  const res = await axiosClient.get<string[]>("/search-utilities/cities");
  return res.data || [];
};

export const fetchRoomCapacities = async (): Promise<string[]> => {
  const res = await axiosClient.get<string[]>("/search-utilities/capacities");
  return res.data || [];
};