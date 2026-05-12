import { createContext, useContext, useReducer, ReactNode } from "react";

export interface Room {
  id: string;
  shopId: string;
  name: string;
  capacity: string;
  pricePerHour: number;
  imageUrl: string;
  available: boolean;
  amenities: string[];
}

export interface BookingState {
  selectedRoom: Room | null;
  date: string;
  startTime: string;
  hours: number;
  shopId: string | null;
  shopName: string | null;
}

type BookingAction =
  | { type: "SET_ROOM"; payload: Room }
  | { type: "SET_SHOP"; payload: { shopId: string; shopName: string } }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_HOURS"; payload: number }
  | { type: "SET_SCHEDULE"; payload: { date: string; startTime: string; hours: number } }
  | { type: "CLEAR_BOOKING" };

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
    case "SET_SCHEDULE":
      return { ...state, ...action.payload };
    case "CLEAR_BOOKING":
      return { selectedRoom: null, date: "", startTime: "", hours: 2, shopId: null, shopName: null };
    default:
      return state;
  }
};

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  totalPrice: number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(bookingReducer, {
    selectedRoom: null,
    date: "",
    startTime: "18:00",
    hours: 2,
    shopId: null,
    shopName: null,
  });

  const totalPrice = state.selectedRoom
    ? state.selectedRoom.pricePerHour * state.hours
    : 0;

  return (
    <BookingContext.Provider value={{ state, dispatch, totalPrice }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};
