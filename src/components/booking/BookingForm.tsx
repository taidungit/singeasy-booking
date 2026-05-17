import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Minus, Plus, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/services/api";
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

  // Tự động set ngày đặt mặc định là hôm nay nếu state.date đang trống
  useEffect(() => {
    if (!state.date) {
      dispatch({ type: "SET_DATE", payload: today });
    }
  }, [state.date, dispatch, today]);

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
    toast({ 
      title: "Missing details", 
      description: "Please fill in all booking fields.", 
      variant: "destructive" 
    });
    return;
  }

  setIsLoading(true);
  try {
    // Không cần dùng "as any", không sợ ESLint bắt lỗi, code chuẩn chỉ điểm mười
    await createBooking({
      roomId: state.selectedRoom.id, 
      bookingDate: state.date,       // Đã khớp hoàn chỉnh với interface BookingReqDto
      startTime: state.startTime,
      duration: state.hours,
      serviceFee: 0.0
    });

    dispatch({ type: "CLEAR_BOOKING" });
    navigate("/dashboard");
    
    toast({ 
      title: "Booking confirmed! 🎉", 
      description: "Check your dashboard for details." 
    });
  } catch (error) {
    console.error("Booking submit error:", error);
    toast({ 
      title: "Booking failed", 
      description: "This room might have been booked or connection lost. Please try again.", 
      variant: "destructive" 
    });
  } finally {
    setIsLoading(false);
  }
};

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
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
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
              disabled={state.hours >= 8}
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
        className="w-full gap-2 py-6 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-100 active:scale-[0.98] transition-all"
        onClick={handleSubmit}
        disabled={isLoading || !state.selectedRoom}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Confirming booking...
          </>
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