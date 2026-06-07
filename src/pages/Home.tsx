import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/booking/SearchBar";
import ShopCard from "@/components/shop/ShopCard";
import axiosClient from "@/services/axiosClient";
import type { Shop } from "@/services/api";
import heroBg from "@/assets/hero-bg.jpg";
import { toast } from "sonner";

const PROMOTIONS = [
  { icon: "🌟", title: "Weekend Flash Deal", desc: "30% off all VIP rooms this Saturday", tag: "Ends soon", color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-500" },
  { icon: "🎂", title: "Birthday Package", desc: "Free snack platter when you book 3+ hours", tag: "Year-round", color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-500" },
  { icon: "👥", title: "Group Discount", desc: "Groups of 8+ get 15% off automatically", tag: "Always on", color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500" },
];

const FEATURES = [
  { icon: Zap, title: "Instant Booking", desc: "Reserve your room in under 60 seconds", glow: "group-hover:text-amber-500 group-hover:bg-amber-500/10 text-amber-600 bg-amber-50" },
  { icon: Shield, title: "Secure Payments", desc: "Your card is never charged until confirmation", glow: "group-hover:text-emerald-500 group-hover:bg-emerald-500/10 text-emerald-600 bg-emerald-50" },
  { icon: Clock, title: "Flexible Hours", desc: "Book from 1 to 8 hours at any time", glow: "group-hover:text-blue-500 group-hover:bg-blue-500/10 text-blue-600 bg-blue-50" },
];

const SkeletonCard = () => (
  <div className="flex flex-col gap-4 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
    <div className="aspect-[4/3] rounded-2xl animate-pulse bg-slate-200" />
    <div className="h-5 w-2/3 rounded animate-pulse bg-slate-200 mt-2" />
    <div className="h-4 w-1/2 rounded animate-pulse bg-slate-200" />
  </div>
);

const Home = () => {
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopRated = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get("/shops", {
          params: { minRating: 4.0, limit: 4 }
        });
        
        const data = Array.isArray(response.data) ? response.data : [];
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
    <div className="animate-fade-in overflow-x-hidden bg-slate-50/50 selection:bg-blue-500 selection:text-white">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background Image & Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Karaoke room" className="w-full h-full object-cover scale-105 animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-950" />
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto mt-12 mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-1.5 mb-8 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90 uppercase">The #1 Karaoke Platform for SingEasy</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Book your perfect<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-200 to-pink-300 bg-clip-text text-transparent italic font-serif font-normal">
              karaoke night
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-300/80 max-w-2xl mx-auto font-normal leading-relaxed mb-12">
            Premium venues across Vietnam. Reserve in seconds, sing all night with SingEasy system.
          </p>
        </div>

        {/* Floating Search Bar Wrapper */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-2 sm:px-4 transform hover:-translate-y-1 transition-transform duration-300">
          <div className="bg-white/5 backdrop-blur-2xl p-3 sm:p-4 rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <SearchBar variant="hero" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 flex gap-12 sm:gap-24 mt-16 px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
          {[["100+", "Venues"], ["5+", "Cities"], ["10k+", "Singers"]].map(([num, label]) => (
            <div key={label} className="text-center group">
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{num}</p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Shops Section ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-0.5 bg-blue-600 rounded-full" />
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Featured</p>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Top-rated venues</h2>
          </div>
          <Link to="/shops" className="w-full sm:w-auto">
            <Button variant="ghost" className="group w-full sm:w-auto justify-center gap-2 text-sm font-bold bg-white hover:bg-slate-100 border border-slate-200/60 rounded-xl px-5 py-5 shadow-sm transition-all">
              View all venues <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredShops.map((shop) => (
                <div key={shop.id} className="hover:-translate-y-2 transition-all duration-300">
                  <ShopCard shop={shop} />
                </div>
              ))
          }
        </div>
      </section>

      {/* ── Promotions Section ─────────────────────────────────────────── */}
      <section className="bg-slate-950 py-28 relative overflow-hidden border-y border-slate-900">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="w-8 h-0.5 bg-indigo-400 rounded-full" />
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Special Offers</p>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Deals & Promotions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROMOTIONS.map((p) => (
              <div key={p.title} className="group bg-gradient-to-b from-white/[0.04] to-transparent rounded-[2rem] p-8 hover:from-white/[0.07] transition-all duration-500 border border-white/[0.06] hover:border-white/10 shadow-2xl hover:shadow-indigo-500/5 flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl filter drop-shadow-md">{p.icon}</div>
                    <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${p.color} border px-3 py-1 rounded-full`}>
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center mb-20">
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Why SingEasy</p>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">The easiest way to book karaoke</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {FEATURES.map(({ icon: Icon, title, desc, glow }) => (
            <div key={title} className="text-center group flex flex-col items-center">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${glow}`}>
                <Icon className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xs font-normal">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call to Action ────────────────────────────────────────────── */}
      <section className="bg-slate-950 py-32 text-center px-4 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-950/20 opacity-70" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-600/20 to-transparent blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Ready to start<br />your night?
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mb-12 max-w-md mx-auto font-normal">
            Join thousands of singers who trust SingEasy for a premium experience.
          </p>
          <Link to="/shops">
            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 rounded-full px-12 py-7 text-base font-black shadow-2xl shadow-blue-500/10 hover:shadow-white/10 hover:scale-105 transition-all duration-300">
              Browse All Venues
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;