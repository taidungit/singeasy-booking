import { createContext, useContext, useReducer, ReactNode } from "react";
import { type Room, type OccupiedSlot } from "@/services/api"; // Import các Type từ file api tập trung

// Định nghĩa cấu trúc State quản lý toàn cục của một đơn Đặt phòng
export interface BookingState {
  selectedRoom: Room | null;
  date: string;
  startTime: string;
  hours: number;
  shopId: string | null;
  shopName: string | null;
  occupiedSlots: OccupiedSlot[]; // Lưu trữ danh sách các khoảng giờ bận của phòng trong ngày
}

// Định nghĩa các hành động (Actions) có thể tác động làm thay đổi State
type BookingAction =
  | { type: "SET_ROOM"; payload: Room }
  | { type: "SET_SHOP"; payload: { shopId: string; shopName: string } }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_HOURS"; payload: number }
  | { type: "SET_OCCUPIED_SLOTS"; payload: OccupiedSlot[] } // Cập nhật danh sách lịch đã bận từ Backend
  | { type: "SET_SCHEDULE"; payload: { date: string; startTime: string; hours: number } }
  | { type: "CLEAR_BOOKING" };

// 🌟 Hàm helper lấy giờ hiện tại của hệ thống và làm tròn (VD: 14:25 -> "14:00") làm giá trị mặc định động
const getSystemCurrentHourStr = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  return `${hours}:00`;
};

// Reducer xử lý biến đổi trạng thái dựa theo từng loại Action cụ thể
const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case "SET_ROOM":
      return { ...state, selectedRoom: action.payload };
    case "SET_SHOP":
      return { ...state, shopId: action.payload.shopId, shopName: action.payload.shopName };
    case "SET_DATE":
      return { ...state, date: action.payload };
    case "SET_TIME":
      return { ...state, startTime: action.payload };
    case "SET_HOURS":
      return { ...state, hours: action.payload };
    case "SET_OCCUPIED_SLOTS":
      return { ...state, occupiedSlots: action.payload };
    case "SET_SCHEDULE":
      return { ...state, ...action.payload };
    case "CLEAR_BOOKING":
      // Reset về trạng thái ban đầu dựa trên thời gian thực tế thay vì fix chết 18:00
      return { 
        selectedRoom: null, 
        date: "", 
        startTime: getSystemCurrentHourStr(), 
        hours: 2, 
        shopId: null, 
        shopName: null, 
        occupiedSlots: [] 
      };
    default:
      return state;
  }
};

// Định nghĩa cấu trúc dữ liệu mà Context sẽ cung cấp xuống các Component con
interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  totalPrice: number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider Component bọc ngoài ứng dụng để chia sẻ State
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(bookingReducer, {
    selectedRoom: null,
    date: "",
    startTime: getSystemCurrentHourStr(), // 🌟 Khởi tạo động theo giờ thực của khách lúc mở app
    hours: 2,
    shopId: null,
    shopName: null,
    occupiedSlots: [], // Khởi tạo mảng trống bận rỗng ban đầu
  });

  // Tự động tính toán tổng tiền dựa trên giá phòng và thời lượng đặt
  const totalPrice = state.selectedRoom
    ? state.selectedRoom.pricePerHour * state.hours
    : 0;

  return (
    <BookingContext.Provider value={{ state, dispatch, totalPrice }}>
      {children}
    </BookingContext.Provider>
  );
};

// Hook tiện ích giúp các Component (như BookingForm) bốc nhanh dữ liệu ra dùng
export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};