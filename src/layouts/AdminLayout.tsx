import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Settings, 
  LogOut, 
  Mic2 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  // Hàm kiểm tra xem Link có đang được active không để đổi màu
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Quản lý Karaoke', path: '/admin/shops', icon: <Store size={20} /> },
    { name: 'Quản lý Người dùng', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col shadow-xl">
        {/* Logo / Header Sidebar */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Mic2 size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Royal</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 mt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={`${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Sidebar / Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 font-medium"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">
            Trang quản trị &nbsp; / &nbsp; 
            <span className="text-slate-900 capitalize">
              {location.pathname.split('/').pop() || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Admin</p>
              <p className="text-xs text-slate-500">Quản trị viên</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;