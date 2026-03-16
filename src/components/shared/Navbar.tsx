import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
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

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">Echo</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/shops" className="nav-link">Browse Shops</Link>
            <Link to="/shops?location=Tokyo" className="nav-link">Tokyo</Link>
            <Link to="/shops?location=Seoul" className="nav-link">Seoul</Link>
            <Link to="/shops?location=Singapore" className="nav-link">Singapore</Link>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
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
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
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
            <Link to="/shops" className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>Browse Shops</Link>
            <div className="h-px bg-border my-2" />
            {state.isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                  <LayoutDashboard className="inline w-4 h-4 mr-2" />Dashboard
                </Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="inline w-4 h-4 mr-2" />Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate("/login"); setIsOpen(false); }}>Log in</Button>
                <Button size="sm" className="flex-1" onClick={() => { navigate("/register"); setIsOpen(false); }}>Sign up</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
