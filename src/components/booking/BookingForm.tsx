import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Minus, Plus, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { createBooking, fetchOccupiedSlots } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const TIME_SLOTS = [
  "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

const BookingForm = () => {
  const { state, dispatch, totalPrice } = useBooking();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // 🟢 1. Hàm check va chạm lịch động dựa vào danh sách bận thu được từ Spring Boot
  const checkTimeCollision = useCallback((startStr: string, durationHours: number): boolean => {
    if (!startStr || !state.occupiedSlots || state.occupiedSlots.length === 0) return false;

    const startHour = Number(startStr.split(":")[0]);
    const endHour = startHour + durationHours;

    for (const slot of state.occupiedSlots) {
      const slotStart = Number(slot.startTime.split(":")[0]);
      const slotEnd = Number(slot.endTime.split(":")[0]);

      // Thuật toán so khớp khoảng Overlap: (Start1 < End2 VÀ End1 > Start2)
      if (startHour < slotEnd && endHour > slotStart) {
        return true; 
      }
    }
    return false;
  }, [state.occupiedSlots]);

  // 🟢 2. Hàm phối hợp chặn cả giờ quá khứ trong ngày lẫn các giờ phòng đã có lịch bận
  const isTimeSlotDisabled = useCallback((timeSlot: string): boolean => {
    if (!state.date) return false;

    // Check quá khứ nếu chọn ngày hôm nay
    if (state.date === today) {
      const currentHour = new Date().getHours();
      const [slotHour] = timeSlot.split(":").map(Number);
      if (slotHour <= currentHour) return true;
    }

    // Check trùng lịch với đơn cũ trong DB (Giả định đặt tối thiểu 1 giờ)
    return checkTimeCollision(timeSlot, 1);
  }, [state.date, today, checkTimeCollision]);

  // Tự động gán ngày hôm nay làm mặc định ban đầu nếu trống
  useEffect(() => {
    if (!state.date) {
      dispatch({ type: "SET_DATE", payload: today });
    }
  }, [state.date, dispatch, today]);

  // 🟢 3. useEffect gọi API bốc lịch bận từ Backend mỗi khi đổi phòng hoặc đổi ngày
  useEffect(() => {
    const loadRoomSchedule = async () => {
      if (!state.selectedRoom?.id || !state.date) return;
      try {
        const slots = await fetchOccupiedSlots(state.selectedRoom.id, state.date);
        dispatch({ type: "SET_OCCUPIED_SLOTS", payload: slots });
      } catch (err) {
        console.error("Failed to load occupied slots:", err);
      }
    };
    loadRoomSchedule();
  }, [state.selectedRoom?.id, state.date, dispatch]);

  // 🟢 4. Tự động kiểm tra điều chỉnh lại StartTime hợp lệ nếu dính slot bận/quá giờ
  useEffect(() => {
    if (state.startTime && isTimeSlotDisabled(state.startTime)) {
      const firstAvailableSlot = TIME_SLOTS.find(t => !isTimeSlotDisabled(t));
      dispatch({ type: "SET_TIME", payload: firstAvailableSlot || "" });
    }
  }, [state.date, isTimeSlotDisabled, state.startTime, dispatch]);

  // 🟢 5. Tự động ép Duration co cụm lại nếu người dùng tăng số giờ vượt quá mốc giờ bận tiếp theo
  useEffect(() => {
    if (state.startTime && state.hours > 1) {
      if (checkTimeCollision(state.startTime, state.hours)) {
        // Thu hẹp thời lượng về mức tối đa có thể cho phép
        let maxAvailableHours = 1;
        while (maxAvailableHours < 8 && !checkTimeCollision(state.startTime, maxAvailableHours + 1)) {
          maxAvailableHours++;
        }
        dispatch({ type: "SET_HOURS", payload: maxAvailableHours });
      }
    }
  }, [state.startTime, state.hours, checkTimeCollision, dispatch]);

  const handleHoursChange = (delta: number) => {
    const next = Math.max(1, Math.min(8, state.hours + delta));
    dispatch({ type: "SET_HOURS", payload: next });
  };

  const handleSubmit = async () => {
    if (!authState.isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    
    if (!state.selectedRoom || !state.date || !state.startTime) {
      toast({ title: "Missing details", description: "Please fill in all booking fields.", variant: "destructive" });
      return;
    }

    if (checkTimeCollision(state.startTime, state.hours)) {
      toast({ title: "Time conflict", description: "The selected duration conflicts with another booking.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await createBooking({
        roomId: state.selectedRoom.id, 
        bookingDate: state.date,       
        startTime: state.startTime,
        duration: state.hours,
        serviceFee: 0.0
      });

      dispatch({ type: "CLEAR_BOOKING" });
      navigate("/dashboard");
      
      toast({ title: "Booking confirmed! 🎉", description: "Check your dashboard for details." });
    } catch (error) {
      console.error("Booking submit error:", error);
      toast({ title: "Booking failed", description: "This room might have been booked. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const isCollisionDetected = checkTimeCollision(state.startTime, state.hours);

  return (
    <div className="space-y-4">
      {/* Date */}
      <div className="booking-field">
        <label className="field-label font-semibold text-xs text-slate-500 uppercase tracking-wider block mb-1">Date</label>
        <div className="flex items-center gap-2 border border-border p-3 rounded-xl bg-slate-50/50 focus-within:border-primary focus-within:bg-white transition-all">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            min={today}
            value={state.date}
            onChange={(e) => dispatch({ type: "SET_DATE", payload: e.target.value })}
            className="flex-1 text-sm bg-transparent focus:outline-none text-foreground font-semibold"
          />
        </div>
      </div>

      {/* Time */}
      <div className="booking-field">
        <label className="field-label font-semibold text-xs text-slate-500 uppercase tracking-wider block mb-1">Start Time</label>
        <div className="flex items-center gap-2 border border-border p-3 rounded-xl bg-slate-50/50 focus-within:border-primary focus-within:bg-white transition-all">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <select
            value={state.startTime}
            onChange={(e) => dispatch({ type: "SET_TIME", payload: e.target.value })}
            className="flex-1 text-sm bg-transparent focus:outline-none text-foreground font-semibold cursor-pointer"
          >
            {!TIME_SLOTS.some(t => !isTimeSlotDisabled(t)) && (
              <option value="">No slots available for this date</option>
            )}
            
            {TIME_SLOTS.map((t) => {
              const disabled = isTimeSlotDisabled(t);
              return (
                <option 
                  key={t} 
                  value={t} 
                  disabled={disabled}
                  className={disabled ? "text-slate-400 bg-slate-100 line-through" : "text-foreground font-medium"}
                >
                  {t} {disabled ? "(Unavailable)" : ""}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Hours */}
      <div className="booking-field">
        <label className="field-label font-semibold text-xs text-slate-500 uppercase tracking-wider block mb-1">Duration</label>
        <div className="flex items-center justify-between border border-border p-3 rounded-xl bg-slate-50/50">
          <span className="text-sm font-semibold text-slate-700">
            {state.hours} {state.hours === 1 ? "hour" : "hours"}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleHoursChange(-1)}
              disabled={state.hours <= 1}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 transition-all shadow-sm"
            >
              <Minus className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <span className="w-4 text-center font-bold text-slate-900 text-sm">{state.hours}</span>
            <button
              type="button"
              onClick={() => handleHoursChange(1)}
              // 🟢 CHẶN NÚT CỘNG: Nếu tăng thêm 1 giờ tiếp theo mà đâm sầm vào lịch bận của người khác thì disable nút cộng
              disabled={state.hours >= 8 || !state.startTime || checkTimeCollision(state.startTime, state.hours + 1)}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      {state.selectedRoom && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2.5">
          <div className="flex justify-between text-sm text-slate-500 font-medium">
            <span>${state.selectedRoom.pricePerHour} × {state.hours} {state.hours === 1 ? "hr" : "hrs"}</span>
            <span className="text-slate-700">${totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500 font-medium">
            <span>Service fee</span>
            <span className="text-slate-700">$0</span>
          </div>
          <div className="h-px bg-slate-200/60" />
          <div className="flex justify-between font-bold text-slate-900">
            <span>Total</span>
            <span className="text-blue-600 text-lg">${totalPrice}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        className={`w-full gap-2 py-6 text-base font-bold text-white rounded-xl shadow-md active:scale-[0.98] transition-all ${
          isCollisionDetected ? "bg-amber-600 hover:bg-amber-700 shadow-amber-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
        }`}
        onClick={handleSubmit}
        disabled={isLoading || !state.selectedRoom || !state.startTime || isCollisionDetected}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Confirming booking...
          </>
        ) : isCollisionDetected ? (
          "Time Slot Conflicting"
        ) : (
          <>
            Reserve Room 
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
      
      <p className="text-center text-[11px] text-slate-400 font-medium">
        You won't be charged yet — Pay at the venue
      </p>
    </div>
  );
};

export default BookingForm;