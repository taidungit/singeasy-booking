import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import ShopList from "@/pages/ShopList";
import ShopDetail from "@/pages/ShopDetail";
import Booking from "@/pages/Booking";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth pages (no layout wrapper) */}
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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
