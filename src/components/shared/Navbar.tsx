import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, History, PhoneCall } from "lucide-react";
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

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              Royal
            </span>
          </Link>

          {/* Desktop Nav - Thêm menu giúp thanh điều hướng đầy đặn, chuyên nghiệp hơn */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/shops"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-20px] after:left-0 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all"
            >
              Browse Shops
            </Link>

            {state.isAuthenticated && (
              <Link
                to="/dashboard" 
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <History className="w-4 h-4" /> My Bookings
              </Link>
            )}

            <Link
              to="/contact"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" /> Contact
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="h-6 w-px bg-border"></div>

            {state.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200 hover:bg-slate-50 font-medium">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold uppercase">
                        {state.user?.name.charAt(0)}
                      </span>
                    </div>
                    {state.user?.name.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-md mt-1">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer py-2">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-slate-500" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive cursor-pointer py-2 focus:bg-destructive/5"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-muted-foreground rounded-xl"
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
              </>
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
            <Link
              to="/shops"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Browse Shops
            </Link>

            {state.isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                My Bookings
              </Link>
            )}

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Contact
            </Link>

            <div className="h-px bg-border my-2" />

            {state.isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <LayoutDashboard className="inline w-4 h-4 mr-2" />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
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
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                >
                  Log in
                </Button>

                <Button
                  size="sm"
                  className="flex-1 rounded-xl"
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