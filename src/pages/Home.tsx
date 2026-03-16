import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/booking/SearchBar";
import ShopCard from "@/components/shop/ShopCard";
import { getFeaturedShops } from "@/services/api";
import type { Shop } from "@/services/api";
import heroBg from "@/assets/hero-bg.jpg";

const PROMOTIONS = [
  { icon: "🌟", title: "Weekend Flash Deal", desc: "30% off all VIP rooms this Saturday", tag: "Ends soon" },
  { icon: "🎂", title: "Birthday Package", desc: "Free snack platter when you book 3+ hours", tag: "Year-round" },
  { icon: "👥", title: "Group Discount", desc: "Groups of 8+ get 15% off automatically", tag: "Always on" },
];

const FEATURES = [
  { icon: Zap, title: "Instant Booking", desc: "Reserve your room in under 60 seconds" },
  { icon: Shield, title: "Secure Payments", desc: "Your card is never charged until confirmation" },
  { icon: Clock, title: "Flexible Hours", desc: "Book from 1 to 8 hours at any time" },
];

const SkeletonCard = () => (
  <div className="flex flex-col gap-3">
    <div className="skeleton aspect-[4/3] rounded-2xl" />
    <div className="skeleton h-4 w-2/3 rounded" />
    <div className="skeleton h-3 w-1/2 rounded" />
  </div>
);

const Home = () => {
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFeaturedShops()
      .then(setFeaturedShops)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="Karaoke room" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/65" />
        </div>

        <div className="relative z-10 text-center px-4 mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-background/15 backdrop-blur-sm border border-background/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="text-sm font-medium text-background/90">Rated #1 karaoke platform in Asia</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-background leading-[1.05] tracking-tight mb-6">
            Book your perfect<br />
            <span className="italic font-serif font-normal text-primary-light" style={{ color: "hsl(221 83% 82%)" }}>
              karaoke night
            </span>
          </h1>
          <p className="text-lg text-background/70 max-w-xl mx-auto mb-10">
            Private rooms in premium venues across Tokyo, Seoul, Singapore and beyond. 
            Reserve in seconds, sing all night.
          </p>
        </div>

        {/* Search bar floats over hero */}
        <div className="relative z-10 w-full flex justify-center px-4">
          <SearchBar variant="hero" />
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-8 sm:gap-16 mt-12 text-background/80">
          {[["200+", "Venues"], ["12", "Cities"], ["50k+", "Happy singers"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-background">{num}</p>
              <p className="text-xs mt-0.5 opacity-70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Shops ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Featured</p>
            <h2 className="section-title">Top-rated venues</h2>
          </div>
          <Link to="/shops">
            <Button variant="ghost" className="gap-1 text-sm">
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
          }
        </div>
      </section>

      {/* ── Promotions ───────────────────────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Special Offers</p>
            <h2 className="section-title">Deals & Promotions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMOTIONS.map((p) => (
              <div key={p.title} className="bg-background rounded-2xl p-6 card-shadow hover:shadow-elevated transition-shadow">
                <div className="text-3xl mb-4">{p.icon}</div>
                <div className="inline-block text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-3">
                  {p.tag}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Echo ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Why Echo</p>
          <h2 className="section-title">The easiest way to book karaoke</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-primary py-20 text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
          Ready to book your room?
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
          Join 50,000+ singers who trust Echo for a perfect night out.
        </p>
        <Link to="/shops">
          <Button variant="secondary" size="lg" className="gap-2 font-bold">
            Browse All Venues <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
