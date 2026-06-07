import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "@/services/axiosClient";
import {
  fetchShops,
  fetchFilteredShops,
  createBooking,
  fetchOccupiedSlots,
  cancelBooking,
} from "@/services/api";

vi.mock("@/services/axiosClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("api service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchShops returns data or empty array", async () => {
    vi.mocked(axiosClient.get).mockResolvedValue({ data: [{ id: "1", name: "Shop" }] });
    await expect(fetchShops()).resolves.toHaveLength(1);

    vi.mocked(axiosClient.get).mockResolvedValue({ data: null });
    await expect(fetchShops()).resolves.toEqual([]);
  });

  it("fetchFilteredShops passes filter params", async () => {
    vi.mocked(axiosClient.get).mockResolvedValue({ data: [] });
    const filters = { name: "Echo", address: "Tokyo", minRating: 4 };

    await fetchFilteredShops(filters);

    expect(axiosClient.get).toHaveBeenCalledWith("/shops/search", { params: filters });
  });

  it("createBooking posts booking payload", async () => {
    const payload = {
      roomId: "room-1",
      bookingDate: "2026-06-07",
      startTime: "18:00",
      duration: 2,
      serviceFee: 0,
    };
    const booking = {
      id: "b1",
      roomId: payload.roomId,
      roomName: "VIP",
      bookingDate: payload.bookingDate,
      startTime: payload.startTime,
      duration: payload.duration,
      pricePerHour: 50,
      serviceFee: 0,
      totalAmount: 100,
      status: "PENDING" as const,
      createdAt: "2026-06-07T10:00:00Z",
      userEmail: "a@b.com",
      userName: "User",
    };
    vi.mocked(axiosClient.post).mockResolvedValue({ data: booking });

    await expect(createBooking(payload)).resolves.toEqual(booking);
    expect(axiosClient.post).toHaveBeenCalledWith("/bookings", payload);
  });

  it("fetchOccupiedSlots requests room schedule for a date", async () => {
    vi.mocked(axiosClient.get).mockResolvedValue({
      data: [{ startTime: "18:00", endTime: "20:00" }],
    });

    await fetchOccupiedSlots("room-1", "2026-06-07");

    expect(axiosClient.get).toHaveBeenCalledWith("/bookings/occupied-slots", {
      params: { roomId: "room-1", date: "2026-06-07" },
    });
  });

  it("cancelBooking calls cancel endpoint", async () => {
    vi.mocked(axiosClient.put).mockResolvedValue({});

    await cancelBooking("booking-1");

    expect(axiosClient.put).toHaveBeenCalledWith("/bookings/booking-1/cancel");
  });
});
