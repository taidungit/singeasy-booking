import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserBookings, cancelBooking } from "@/services/api";
import type { Booking } from "@/services/api";
import { Button } from "@/components/ui/button";

const statusConfig = {
  confirmed: { label: "Confirmed", cls: "badge-confirmed" },
  pending: { label: "Pending", cls: "badge-pending" },
  cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

const BookingCard = ({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const isPast = new Date(booking.date) < new Date();
  const cfg = statusConfig[booking.status];

  const handleCancel = async () => {
    if (!confirm("Cancel this booking?")) return;
    setIsCancelling(true);
    await cancelBooking(booking.id);
    onCancel(booking.id);
    setIsCancelling(false);
  };

  return (
    <div className="bg-background border border-border rounded-2xl p-5 hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.cls}`}>
              {cfg.label}
            </span>
            {isPast && booking.status !== "cancelled" && (
              <span className="text-xs text-muted-foreground">Completed</span>
            )}
          </div>
          <h3 className="font-bold text-foreground text-lg leading-tight">{booking.shopName}</h3>
          <p className="text-sm text-muted-foreground font-medium">{booking.roomName}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">${booking.totalPrice}</p>
          <p className="text-xs text-muted-foreground">total</p>
        </div>
      </div>

      <div className="h-px bg-border my-4" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          {new Date(booking.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary" />
          {booking.startTime} · {booking.hours}h
        </span>
        <span className="text-xs opacity-60">Booked {new Date(booking.createdAt).toLocaleDateString()}</span>
      </div>

      {booking.status !== "cancelled" && !isPast && (
        <div className="mt-4 flex gap-2">
          <Link to={`/shops/${booking.shopId}`}>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              View Venue <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? <><Loader2 className="w-3 h-3 animate-spin" /> Cancelling...</> : "Cancel booking"}
          </Button>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchUserBookings()
      .then(setBookings)
      .finally(() => setIsLoading(false));
  }, [authState.isAuthenticated, navigate]);

  const handleCancel = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
  };

  const upcoming = bookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status !== "cancelled"
  );
  const history = bookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === "cancelled"
  );

  if (!authState.isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Welcome back, {authState.user?.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">{authState.user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total bookings", value: bookings.length },
          { label: "Upcoming", value: upcoming.length },
          { label: "Completed", value: bookings.filter((b) => new Date(b.date) < new Date() && b.status !== "cancelled").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-2xl p-4 text-center border border-border">
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {(["upcoming", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "upcoming" ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {(activeTab === "upcoming" ? upcoming : history).map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))}
          {(activeTab === "upcoming" ? upcoming : history).length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-muted-foreground text-sm">
                {activeTab === "upcoming"
                  ? "No upcoming bookings. Time to book a room!"
                  : "No booking history yet."}
              </p>
              {activeTab === "upcoming" && (
                <Button className="mt-4" onClick={() => navigate("/shops")}>
                  Browse Venues
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
