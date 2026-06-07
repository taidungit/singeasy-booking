import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import gif400 from "@/assets/400.gif"; // 1. Import file GIF từ assets

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center overflow-hidden">
      {/* Background Glows hiệu ứng ánh đèn phòng Karaoke */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex max-w-md flex-col items-center">
        {/* 2. Hiển thị ảnh GIF với bo góc mịn và shadow đổ bóng */}
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-md max-w-[360px] sm:max-w-full">
          <img 
            src={gif400} 
            alt="Page Not Found" 
            className="h-auto w-full rounded-[1.7rem] object-cover"
          />
        </div>

        {/* Thông tin lỗi */}
        <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4">
          Error Code: 404
        </span>
        
        <h1 className="mb-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
          Where are we going?
        </h1>
        
        <p className="mb-8 text-base text-slate-400 leading-relaxed">
          The stage you are looking for doesn't exist or has been moved to another premium room.
        </p>

        {/* 3. Nút điều hướng mượt mà, không load lại trang */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-slate-800 bg-transparent text-slate-300 hover:bg-slate-900 hover:text-white rounded-full px-6 py-6 font-bold gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>

          <Link to="/">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 rounded-full px-8 py-6 font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all gap-2">
              <Home className="w-4 h-4" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;