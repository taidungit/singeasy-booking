import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
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
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={scrollTop}
            className="flex items-center gap-3 group"
          >
          <img 
            src={logo} 
            alt="Royal Logo"
            className="w-14 h-14 object-cover rounded-lg"
          />

            <span className="font-bold text-lg tracking-tight text-foreground">
              Royal
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/shops"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Shops
            </Link>

            <Link
              to="/shops?location=Tokyo"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tokyo
            </Link>

            <Link
              to="/shops?location=Seoul"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Seoul
            </Link>

            <Link
              to="/shops?location=Singapore"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Singapore
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-4">

            <div className="h-6 w-px bg-border"></div>

            {state.isAuthenticated ? (
              <DropdownMenu>

                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">
                        {state.user?.name.charAt(0)}
                      </span>
                    </div>

                    {state.user?.name.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">

                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive"
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
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>

                <Button
                  size="sm"
                  className="rounded-full px-5 shadow-sm hover:shadow-md transition-shadow"
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

            <Link
              to="/shops?location=Tokyo"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Tokyo
            </Link>

            <Link
              to="/shops?location=Seoul"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Seoul
            </Link>

            <Link
              to="/shops?location=Singapore"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Singapore
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
                  className="flex-1"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                >
                  Log in
                </Button>

                <Button
                  size="sm"
                  className="flex-1"
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