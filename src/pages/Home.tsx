import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/booking/SearchBar";
import ShopCard from "@/components/shop/ShopCard";
import axiosClient from "@/services/axiosClient";
import type { Shop } from "@/services/api";
import heroBg from "@/assets/hero-bg.jpg";
import { toast } from "sonner";

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
    <div className="aspect-[4/3] rounded-2xl animate-pulse bg-slate-200" />
    <div className="h-4 w-2/3 rounded animate-pulse bg-slate-200" />
    <div className="h-3 w-1/2 rounded animate-pulse bg-slate-200" />
  </div>
);

const Home = () => {
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Top-rated venues from Spring Boot Backend
  useEffect(() => {
    const loadTopRated = async () => {
      try {
        setIsLoading(true);
        // Gọi API lấy danh sách shop (tương ứng với hình image_7fd6a2.jpg)
        const response = await axiosClient.get("/shops", {
          params: {
            minRating: 4.0, // Lấy các shop có đánh giá tốt
            limit: 4        // Hiển thị 4 card như thiết kế
          }
        });
        
        const data = Array.isArray(response.data) ? response.data : [];
        // Sắp xếp theo rating cao nhất (logic xử lý tại client)
        const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setFeaturedShops(sorted.slice(0, 4));
      } catch (error) {
        console.error("Home load error:", error);
        toast.error("Unable to load top-rated venues");
      } finally {
        setIsLoading(false);
      }
    };

    loadTopRated();
  }, []);

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="Karaoke room" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">The #1 Karaoke Platform for SingEasy</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Book your perfect<br />
            <span className="italic font-serif font-normal text-blue-200">
              karaoke night
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
            Premium venues across Vietnam. Reserve in seconds, sing all night with SingEasy system.
          </p>
        </div>

        {/* Floating Search Bar */}
        <div className="relative z-10 w-full flex justify-center px-4">
          <SearchBar variant="hero" />
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-8 sm:gap-16 mt-12 text-white/80">
          {[["100+", "Venues"], ["5+", "Cities"], ["10k+", "Happy singers"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-white">{num}</p>
              <p className="text-xs mt-0.5 opacity-70 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Shops Section (image_7fd6a2.jpg) ──────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Featured</p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Top-rated venues</h2>
          </div>
          <Link to="/shops">
            <Button variant="ghost" className="group gap-2 text-sm font-bold hover:bg-slate-100">
              View all <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
          }
        </div>
      </section>

      {/* ── Promotions Section ─────────────────────────────────────────── */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Special Offers</p>
            <h2 className="text-3xl font-bold text-slate-900">Deals & Promotions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROMOTIONS.map((p) => (
              <div key={p.title} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className="text-4xl mb-6">{p.icon}</div>
                <div className="inline-block text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-4">
                  {p.tag}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Why SingEasy</p>
          <h2 className="text-4xl font-bold text-slate-900">The easiest way to book karaoke</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call to Action ────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
          Ready to start your night?
        </h2>
        <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg">
          Join thousands of singers who trust SingEasy for a premium experience.
        </p>
        <Link to="/shops">
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-10 py-7 text-lg font-bold shadow-2xl">
            Browse All Venues
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;