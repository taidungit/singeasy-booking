import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "@/assets/royal-logo.avif";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  LogOut, 
  Mic2,
  UserIcon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const { state, logout } = useAuth();
  const { user } = state; 
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Shop Management', path: '/admin/shops', icon: <Store size={20} /> },
    { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
  ];

  const renderBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    let currentPath = '';

    return (
      <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium select-none">
        <Link to="/admin" className="hover:text-slate-900 transition-colors">Administration</Link>
        {paths.map((path, index) => {
          if (path === 'admin') return null; 
          currentPath += `/${path}`;
          
          const isId = !isNaN(Number(path));
          const displayName = isId ? `#${path}` : path.replace(/-/g, ' ');
          const isLast = index === paths.length - 1;

          return (
            <React.Fragment key={currentPath}>
              <ChevronRight size={14} className="text-slate-400 shrink-0" />
              {isLast ? (
                <span className="text-slate-900 font-semibold capitalize">{displayName}</span>
              ) : (
                <Link 
                  to={index === 1 ? `/admin/${path}` : `/admin/shops`} 
                  className="hover:text-slate-900 transition-colors capitalize"
                >
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col shadow-xl shrink-0 z-10">
        
        {/* 🟢 KHỐI LOGO ĐÃ ĐƯỢC PHÓNG TO & CÂN ĐỐI LẠI ĐẸP MẮT */}
        <div className="h-20 px-6 flex items-center border-b border-slate-700/40 bg-[#1a2332]/50">
          <Link
            to="/"
            onClick={scrollTop}
            className="flex items-center gap-3.5 group select-none outline-none"
          >
            {/* Tăng kích thước khung chứa ảnh từ w-9 h-9 lên w-12 h-12 */}
            <div className="w-12 h-12 relative overflow-hidden rounded-xl border border-slate-600/40 bg-slate-900 shadow-md flex-shrink-0">
              <img 
                src={logo} 
                alt="Royal Logo"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Tăng cỡ chữ từ text-base/text-lg lên text-xl font-bold */}
            <span className="font-bold text-xl tracking-tight text-white transition-colors duration-200 group-hover:text-blue-400">
              Royal
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 mt-2">
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                      : 'hover:bg-slate-800/60 hover:text-white font-medium'
                  }`}
                >
                  <span className={`${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Sidebar / Logout */}
        <div className="p-4 border-t border-slate-700/40">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 font-semibold text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          {renderBreadcrumbs()}

          {/* User Information Profile Dropdown */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block select-none">
              <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Administrator</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-full border-2 border-slate-100 bg-slate-100 shadow-sm overflow-hidden flex items-center justify-center hover:border-blue-500 hover:shadow-md transition-all outline-none cursor-pointer">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Admin Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-700 text-xs font-black uppercase">
                      {user?.name ? user.name.charAt(0) : "A"}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl mt-2 p-1.5 border border-slate-100 bg-white animate-in fade-in slide-in-from-top-2 duration-150">
                <DropdownMenuItem 
                  onClick={() => navigate("/profile")} 
                  className="cursor-pointer py-2 px-3 rounded-lg font-medium text-slate-600 focus:bg-slate-50 focus:text-slate-900 text-sm"
                >
                  <UserIcon className="w-4 h-4 mr-2.5 text-slate-400" /> 
                  Edit My Profile
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => navigate("/")} 
                  className="cursor-pointer py-2 px-3 rounded-lg font-medium text-slate-600 focus:bg-slate-50 focus:text-slate-900 text-sm"
                >
                  <Mic2 className="w-4 h-4 mr-2.5 text-slate-400" /> 
                  Go to Client Site
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-slate-100" />

                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 cursor-pointer py-2 px-3 rounded-lg font-semibold focus:bg-red-50/60 focus:text-red-700 text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* View Layout Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;