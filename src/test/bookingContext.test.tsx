import { describe, it, expect, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import type { Room } from "@/services/api";

const wrapper = ({ children }: { children: ReactNode }) => (
  <BookingProvider>{children}</BookingProvider>
);

const mockRoom: Room = {
  id: "room-1",
  shopId: "shop-1",
  name: "VIP Room",
  capacity: "medium",
  pricePerHour: 50,
  imageUrl: "",
  status: "AVAILABLE",
  amenities: [],
  fullyBooked: false,
};

describe("BookingContext", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates totalPrice from room price and hours", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.dispatch({ type: "SET_ROOM", payload: mockRoom });
      result.current.dispatch({ type: "SET_HOURS", payload: 3 });
    });

    expect(result.current.totalPrice).toBe(150);
  });

  it("updates schedule via SET_SCHEDULE", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: "SET_SCHEDULE",
        payload: { date: "2026-06-07", startTime: "18:00", hours: 4 },
      });
    });

    expect(result.current.state.date).toBe("2026-06-07");
    expect(result.current.state.startTime).toBe("18:00");
    expect(result.current.state.hours).toBe(4);
  });

  it("resets state on CLEAR_BOOKING", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 7, 16, 45));

    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.dispatch({ type: "SET_ROOM", payload: mockRoom });
      result.current.dispatch({ type: "SET_DATE", payload: "2026-06-07" });
      result.current.dispatch({
        type: "SET_OCCUPIED_SLOTS",
        payload: [{ startTime: "18:00", endTime: "20:00" }],
      });
      result.current.dispatch({ type: "CLEAR_BOOKING" });
    });

    expect(result.current.state.selectedRoom).toBeNull();
    expect(result.current.state.date).toBe("");
    expect(result.current.state.startTime).toBe("16:00");
    expect(result.current.state.hours).toBe(2);
    expect(result.current.state.occupiedSlots).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
  });
});
