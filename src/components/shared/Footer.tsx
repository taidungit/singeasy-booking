import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/royal-logo.avif";
import { fetchActiveCities } from "@/services/api";

const Footer = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveCities()
      .then((data) => setCities(data.slice(0, 4)))
      .catch(() => setCities(["Hanoi", "Ho Chi Minh", "Da Nang", "Hai Phong"])) // Fallback nếu lỗi API
      .finally(() => setIsLoading(false));
  }, []);

  // Định cấu trúc dữ liệu tĩnh cho Menu để rút gọn code JSX bên dưới
  const accountLinks = [
    { to: "/login", label: "Log in" },
    { to: "/register", label: "Create account" },
    { to: "/dashboard", label: "My Bookings" },
  ];

  return (
    <footer className="bg-foreground text-background border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* ── Brand & Logo (Đã thu gọn kích thước) ───────────────────── */}
          <div className="md:col-span-1">
            <Link to="/" className="group inline-block mb-5">
              {/* Sửa từ w-20 h-20 xuống w-14 h-14 để gọn gàng, tinh tế hơn */}
              <div className="w-14 h-14 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950 shadow-xl shadow-primary/5 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-primary/10 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="SingEasy Logo"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <p className="text-sm opacity-60 leading-relaxed">
              The world's most trusted karaoke room booking platform. Discover, book, and sing with SingEasy system.
            </p>
          </div>

          {/* ── Explore (Render động từ API) ────────────────────────────── */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Explore</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li>
                <Link to="/shops" className="hover:opacity-100 transition-opacity font-medium text-blue-400">
                  All Venues
                </Link>
              </li>
              {isLoading 
                ? Array.from({ length: 3 }).map((_, i) => <li key={i} className="h-4 w-24 bg-slate-800 animate-pulse rounded" />)
                : cities.map((city) => (
                    <li key={city}>
                      <Link to={`/shops?location=${encodeURIComponent(city)}`} className="hover:opacity-100 transition-opacity capitalize">
                        {city}
                      </Link>
                    </li>
                  ))
              }
            </ul>
          </div>

          {/* ── Account (Đã tối ưu loop mảng) ───────────────────────────── */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Account</h4>
            <ul className="space-y-3 text-sm opacity-70">
              {accountLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:opacity-100 transition-opacity">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact (Khớp chuẩn dữ liệu file Contact.tsx) ───────────── */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Contact</h4>
            <ul className="space-y-4 text-sm opacity-70">
              <li className="flex items-center gap-2.5 group">
                <Mail className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-white transition-colors" />
                <a href="mailto:support@singeasy.com" className="hover:underline hover:opacity-100">support@singeasy.com</a>
              </li>
              <li className="flex items-center gap-2.5 group">
                <Phone className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-white transition-colors" />
                <a href="tel:+842412345678" className="hover:underline hover:opacity-100">+84 24-1234-5678</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400 mt-0.5" />
                <span className="leading-tight">Dai Co Viet Road, Hai Ba Trung District, Hanoi, Vietnam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-background/10 my-10" />

        {/* ── Copyright & Legal ─────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40">
          <p>© 2026 SingEasy. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((text) => (
              <span key={text} className="hover:opacity-100 cursor-pointer transition-opacity">{text}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;