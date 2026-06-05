import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; 
import { Menu, X, LogOut, LayoutDashboard, History, PhoneCall, UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/royal-logo.avif";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 🌟 Kiểm tra xem user có quyền admin hay không
  const isAdmin = state.isAuthenticated && state.user?.role === "ADMIN";

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hàm helper định nghĩa style Active cho Desktop
  const desktopLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold transition-all relative py-1 flex items-center gap-1.5 ${
      isActive
        ? "text-slate-900 after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-[2.5px] after:bg-blue-600"
        : "text-muted-foreground hover:text-slate-900 after:absolute after:bottom-[-20px] after:left-0 after:w-0 after:h-[2.5px] after:bg-blue-600 hover:after:w-full after:transition-all"
    }`;

  // Hàm helper định nghĩa style Active cho Mobile
  const mobileLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={scrollTop}
            className="flex items-center gap-3 group shrink-0"
          >
            <img 
              src={logo} 
              alt="Royal Logo"
              className="w-11 h-11 object-cover rounded-xl transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-lg tracking-tight text-foreground">
              SingEasy
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/shops" className={desktopLinkStyle}>
              Browse Shops
            </NavLink>

            {state.isAuthenticated && (
              <NavLink to="/dashboard" className={desktopLinkStyle}>
                <History className="w-4 h-4" /> My Bookings
              </NavLink>
            )}

            <NavLink to="/contact" className={desktopLinkStyle}>
              <PhoneCall className="w-4 h-4" /> Contact
            </NavLink>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="h-6 w-px bg-border"></div>

            {state.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold shadow-sm py-5">
                    
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm overflow-hidden bg-amber-500 shrink-0">
                      {state.user?.avatar ? (
                        <img 
                          src={state.user.avatar} 
                          alt="User Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-black uppercase">
                          {state.user?.name ? state.user.name.charAt(0) : "U"}
                        </span>
                      )}
                    </div>

                    <span className="text-slate-700 font-bold text-sm">
                      {state.user?.name ? state.user.name.split(" ")[0] : "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-md mt-1">
                  
                  {/* 🌟 NÚT ĐẾN TRANG QUẢN TRỊ (CHỈ HIỂN THỊ KHI LÀ ADMIN) */}
                  {isAdmin && (
                    <DropdownMenuItem 
                      onClick={() => navigate("/admin")} 
                      className="cursor-pointer py-2 font-bold text-blue-600 focus:text-blue-700 focus:bg-blue-50/80"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" /> 
                      Go to Admin Site
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")} 
                    className="cursor-pointer py-2 font-medium"
                  >
                    <UserIcon className="w-4 h-4 mr-2 text-slate-500" /> 
                    My Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer py-2 font-medium">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-slate-500" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive cursor-pointer py-2 focus:bg-destructive/5 font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-muted-foreground rounded-xl"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>

                <Button
                  size="sm"
                  className="rounded-xl px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-1 animate-fade-in">
            <NavLink
              to="/shops"
              onClick={() => setIsOpen(false)}
              className={mobileLinkStyle}
            >
              Browse Shops
            </NavLink>

            {state.isAuthenticated && (
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={mobileLinkStyle}
              >
                My Bookings
              </NavLink>
            )}

            <NavLink
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={mobileLinkStyle}
            >
              Contact
            </NavLink>

            <div className="h-px bg-border my-2" />

            {state.isAuthenticated ? (
              <>
                {/* ĐỒNG BỘ: Hiện cả lối tắt Admin ở menu mobile cho tiện lợi */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <ShieldCheck className="inline w-4 h-4 mr-2" />
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <UserIcon className="inline w-4 h-4 mr-2 text-slate-500" />
                  My Profile
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <LayoutDashboard className="inline w-4 h-4 mr-2" />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="inline w-4 h-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl font-semibold"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                >
                  Log in
                </Button>

                <Button
                  size="sm"
                  className="flex-1 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;