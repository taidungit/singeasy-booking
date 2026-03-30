import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext"; 
import { BookingProvider } from "@/context/BookingContext";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout"; 
import Home from "@/pages/Home";
import ShopList from "@/pages/ShopList";
import ShopDetail from "@/pages/ShopDetail";
import Booking from "@/pages/Booking";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "./pages/NotFound";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import ShopManagement from "@/pages/admin/ShopManagement";
import RoomManagement from "@/pages/admin/RoomManagement";
import UserManagement from "@/pages/admin/UserManagement"; 

const queryClient = new QueryClient();

// --- ĐOẠN SỬA LẠI ---
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth(); // Lấy 'state' từ context
  const { user, isLoading } = state;

  // Nếu đang check login thì có thể hiện loading (tùy chọn)
  if (isLoading) return <div>Loading...</div>;

  // Kiểm tra user và quyền admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
// ----------------------

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Main layout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shops" element={<ShopList />} />
                <Route path="/shops/:id" element={<ShopDetail />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* Admin Layout */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="shops" element={<ShopManagement />} />
                <Route path="shops/:shopId/rooms" element={<RoomManagement />} />
                <Route path="users" element={<UserManagement />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;