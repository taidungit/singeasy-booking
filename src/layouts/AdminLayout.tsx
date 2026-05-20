import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
  const { user } = state; // Lấy thông tin admin đang đăng nhập từ context
  const location = useLocation();
  const navigate = useNavigate();

  // Hàm kiểm tra xem Link có đang được active không để đổi màu (Hỗ trợ tốt các route con)
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

  // 💡 HÀM GENERATE BREADCRUMB TƯƠNG TÁC ĐƯỢC ĐỂ CLICK BACK VỀ TRANG TRƯỚC
  // Biến cấu trúc như "/admin/shops/1/bookings" thành các nút bấm tương tác được
  const renderBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    let currentPath = '';

    return (
      <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
        <Link to="/admin" className="hover:text-slate-900 transition-colors">Administration</Link>
        {paths.map((path, index) => {
          if (path === 'admin') return null; // Bỏ qua chữ admin đầu tiên vì đã có nút phía trước
          currentPath += `/${path}`;
          
          // Kiểm tra xem đoạn đường dẫn này có phải là ID (số) không, nếu là ID thì hiển thị đẹp hơn
          const isId = !isNaN(Number(path));
          const displayName = isId ? `#${path}` : path.replace(/-/g, ' ');

          // Nếu là phần tử cuối cùng thì không cho click (đang đứng ở đó)
          const isLast = index === paths.length - 1;

          return (
            <React.Fragment key={currentPath}>
              <ChevronRight size={14} className="text-slate-400 shrink-0" />
              {isLast ? (
                <span className="text-slate-900 font-semibold capitalize">{displayName}</span>
              ) : (
                <Link 
                  to={index === 1 ? `/admin/${path}` : `/admin/shops`} // Tùy biến linh hoạt để back về trang quản lý cha
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
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          {/* 💡 ĐÃ CẬP NHẬT: Breadcrumbs có khả năng click để quay lại */}
          {renderBreadcrumbs()}

          {/* 💡 ĐÃ SỬA: Khối thông tin admin đồng bộ ảnh, tên từ Context và tích hợp Dropdown y hệt Client */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden flex items-center justify-center hover:opacity-90 transition-all outline-none">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Admin Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-700 text-sm font-bold uppercase">
                      {user?.name ? user.name.charAt(0) : "A"}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-md mt-2">
                <DropdownMenuItem 
                  onClick={() => navigate("/profile")} 
                  className="cursor-pointer py-2 font-medium"
                >
                  <UserIcon className="w-4 h-4 mr-2 text-slate-500" /> 
                  Edit My Profile
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => navigate("/")} 
                  className="cursor-pointer py-2 font-medium"
                >
                  <Mic2 className="w-4 h-4 mr-2 text-slate-500" /> 
                  Go to Client Site
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