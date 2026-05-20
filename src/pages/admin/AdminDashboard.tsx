import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, DoorOpen, Users, CalendarCheck, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosClient from "@/services/axiosClient";
import { toast } from "sonner";

// Định nghĩa kiểu dữ liệu khớp chính xác với DTO tinh giản từ Backend
interface DashboardStats {
  totalShops: number;
  totalRooms: number;
  totalUsers: number;
  pendingBookings: number;
}

interface RevenueChartData {
  name: string; // E.g., "Mon", "Tue", "Wed"...
  revenue: number;
}

interface RecentActivity {
  id: string | number;
  description: string;
  timeAgo: string;
  branchName: string;
}

interface DashboardData {
  stats: DashboardStats;
  chartData: RevenueChartData[];
  recentActivities: RecentActivity[];
}

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm gọi API lấy dữ liệu tổng hợp cho Dashboard
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get<DashboardData>("/dashboard/summary");
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard metrics:", error);
      toast.error("Could not load system statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Trạng thái Loading khi đang chờ Backend trả dữ liệu
  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-slate-50/30 min-h-screen">
        <Loader2 className="w-9 h-9 animate-spin text-blue-600 mb-2" />
        <p className="text-slate-400 text-sm font-medium">Loading system metrics...</p>
      </div>
    );
  }

  // Cấu hình mảng hiển thị cho 4 ô Thống kê cốt lõi
  const statsCards = [
    { 
      title: "Total Shops", 
      value: data.stats.totalShops.toLocaleString(), 
      icon: <Store className="h-5 w-5 text-blue-600" />, 
      desc: "Active karaoke branches" 
    },
    { 
      title: "Total Rooms", 
      value: data.stats.totalRooms.toLocaleString(), 
      icon: <DoorOpen className="h-5 w-5 text-green-600" />, 
      desc: "Total operational rooms" 
    },
    { 
      title: "Total Users", 
      value: data.stats.totalUsers.toLocaleString(), 
      icon: <Users className="h-5 w-5 text-purple-600" />, 
      desc: "Registered customer accounts" 
    },
    { 
      title: "Pending Approvals", 
      value: data.stats.pendingBookings.toLocaleString(), 
      icon: <CalendarCheck className="h-5 w-5 text-orange-600" />, 
      desc: "Requires immediate review" 
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50/30 min-h-screen font-sans">
      
      {/* Upper Header Titles */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Analytics</h1>
        <p className="text-slate-500">Welcome back to your administration dashboard.</p>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((s, i) => (
          <Card key={i} className="shadow-sm border-slate-200 rounded-[20px] bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{s.title}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Main Content Charts Section */}
      {/* 💡 ĐỒNG BỘ: Chuyển sang hệ grid 8 cột để chia đều không gian */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
        
        {/* Left Side: Weekly Revenue Chart (Takes 4 columns) */}
        {/* 💡 CÂN BẰNG: Đổi col-span thành 4 và giảm chiều cao xuống 260px */}
        <Card className="lg:col-span-4 rounded-[24px] p-6 shadow-sm border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500"/> Weekly Revenue Trend
            </h3>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)'}} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Side: Real-time Activity Logger (Takes 4 columns) */}
        {/* 💡 CÂN BẰNG: Tăng không gian hiển thị lên 4 cột bằng với bên biểu đồ */}
        <Card className="lg:col-span-4 rounded-[24px] p-6 shadow-sm border-slate-200 bg-white">
          <h3 className="font-bold text-slate-800 mb-6">Recent Activities</h3>
          <div className="space-y-6">
            {data.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 text-sm">
                  <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-700">{activity.description}</p>
                    <p className="text-xs text-slate-400">
                      {activity.timeAgo} • {activity.branchName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 font-medium text-center py-10">No recent system activities found.</p>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AdminDashboard;