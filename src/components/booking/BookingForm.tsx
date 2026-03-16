import { useState } from "react";
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

  const handleHoursChange = (delta: number) => {
    const next = Math.max(1, Math.min(8, state.hours + delta));
    dispatch({ type: "SET_HOURS", payload: next });
  };

  const handleSubmit = async () => {
    if (!authState.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!state.selectedRoom || !state.date || !state.startTime) {
      toast({ title: "Missing details", description: "Please fill in all booking fields.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await createBooking({
        shopId: state.shopId!,
        shopName: state.shopName!,
        roomId: state.selectedRoom.id,
        roomName: state.selectedRoom.name,
        date: state.date,
        startTime: state.startTime,
        hours: state.hours,
        totalPrice,
        status: "confirmed",
      });
      dispatch({ type: "CLEAR_BOOKING" });
      navigate("/dashboard");
      toast({ title: "Booking confirmed! 🎉", description: "Check your dashboard for details." });
    } catch {
      toast({ title: "Booking failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Date */}
      <div className="booking-field">
        <label className="field-label">Date</label>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            min={today}
            value={state.date}
            onChange={(e) => dispatch({ type: "SET_DATE", payload: e.target.value })}
            className="flex-1 text-sm bg-transparent focus:outline-none text-foreground font-medium"
          />
        </div>
      </div>

      {/* Time */}
      <div className="booking-field">
        <label className="field-label">Start Time</label>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <select
            value={state.startTime}
            onChange={(e) => dispatch({ type: "SET_TIME", payload: e.target.value })}
            className="flex-1 text-sm bg-transparent focus:outline-none text-foreground font-medium"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hours */}
      <div className="booking-field">
        <label className="field-label">Duration</label>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {state.hours} {state.hours === 1 ? "hour" : "hours"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleHoursChange(-1)}
              disabled={state.hours <= 1}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center font-bold text-foreground">{state.hours}</span>
            <button
              onClick={() => handleHoursChange(1)}
              disabled={state.hours >= 8}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      {state.selectedRoom && (
        <div className="bg-surface rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${state.selectedRoom.pricePerHour} × {state.hours} {state.hours === 1 ? "hr" : "hrs"}</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Service fee</span>
            <span>$0</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between font-bold text-foreground">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      <Button
        className="w-full gap-2 py-6 text-base font-bold active:scale-[0.98] transition-transform"
        onClick={handleSubmit}
        disabled={isLoading || !state.selectedRoom}
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Confirming...</>
        ) : (
          <>Reserve Room <ArrowRight className="w-4 h-4" /></>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        You won't be charged yet
      </p>
    </div>
  );
};

export default BookingForm;
