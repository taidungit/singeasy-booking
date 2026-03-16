import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, Music } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import BookingForm from "@/components/booking/BookingForm";
import { Button } from "@/components/ui/button";

const Booking = () => {
  const { state, totalPrice } = useBooking();
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login?redirect=/booking");
    }
  }, [authState.isAuthenticated, navigate]);

  if (!state.selectedRoom) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🎤</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">No room selected</h2>
        <p className="text-muted-foreground mb-6">Please browse our venues and select a room first.</p>
        <Button onClick={() => navigate("/shops")}>Browse Venues</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to venue
      </button>

      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Confirm your booking</h1>
      <p className="text-muted-foreground mb-10">Review your selection and choose your schedule.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Room Summary */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your selection</h2>

          {/* Room card */}
          <div className="bg-surface rounded-2xl overflow-hidden border border-border mb-6">
            <div className="aspect-[16/7] overflow-hidden">
              <img
                src={state.selectedRoom.image}
                alt={state.selectedRoom.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{state.shopName}</p>
              <h3 className="text-xl font-bold text-foreground mb-1">{state.selectedRoom.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Capacity: {state.selectedRoom.capacity} people
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Included amenities</h3>
            <div className="flex flex-wrap gap-2">
              {state.selectedRoom.amenities.map((a) => (
                <span key={a} className="flex items-center gap-1.5 text-xs font-medium bg-background border border-border px-3 py-1.5 rounded-full">
                  <Music className="w-3 h-3 text-primary" />
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Price summary card */}
          <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Price breakdown</h3>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${state.selectedRoom.pricePerHour}/hr × {state.hours} hrs</span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Service fee</span>
              <span>$0</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
            {state.date && (
              <div className="pt-2 space-y-1.5 text-sm text-muted-foreground">
                {state.date && (
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {new Date(state.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {state.startTime} — {(parseInt(state.startTime.split(":")[0]) + state.hours).toString().padStart(2, "0")}:00
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking Form */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Choose your schedule</h2>
          <div className="bg-background border border-border rounded-2xl p-5">
            <BookingForm />
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Need help? <Link to="/" className="text-primary hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;
