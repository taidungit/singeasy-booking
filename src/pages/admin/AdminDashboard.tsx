import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, DoorOpen, Users, CalendarCheck, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosClient from "@/services/axiosClient";
import { useEffect, useState } from "react";
const data = [
  { name: 'Th2', revenue: 4000 }, { name: 'Th3', revenue: 3000 },
  { name: 'Th4', revenue: 5000 }, { name: 'Th5', revenue: 4500 },
  { name: 'Th6', revenue: 6000 }, { name: 'Th7', revenue: 8000 },
  { name: 'CN', revenue: 7000 },
];

const AdminDashboard = () => {
  const stats = [
    { title: "Tổng số Shop", value: "12", icon: <Store className="h-5 w-5 text-blue-600" />, desc: "2 shop mới tháng này" },
    { title: "Tổng số Phòng", value: "156", icon: <DoorOpen className="h-5 w-5 text-green-600" />, desc: "85% công suất" },
    { title: "Người dùng", value: "1,240", icon: <Users className="h-5 w-5 text-purple-600" />, desc: "+12% tháng trước" },
    { title: "Đơn đặt phòng", value: "48", icon: <CalendarCheck className="h-5 w-5 text-orange-600" />, desc: "Đang chờ xử lý" },
  ];

// const AdminDashboard = () => {
//   const [stats, setStats] = useState<any[]>([]);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await axiosClient.get('/admin/dashboard-summary');
//         // Giả sử response.data trả về { totalShops, totalRooms, totalUsers, bookingsPending, revenueChart }
//         const { data } = response;
        
//         setStats([
//           { title: "Tổng số Shop", value: data.totalShops, icon: <Store className="..." />, desc: "Dữ liệu thực tế" },
//           { title: "Tổng số Phòng", value: data.totalRooms, icon: <DoorOpen className="..." />, desc: `${data.occupancyRate}% công suất` },
//           // ... tương tự cho các cái khác
//         ]);
//         setChartData(data.revenueChart);
//       } catch (error) {
//         console.error("Lỗi lấy stats:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   if (loading) return <div>Đang tải dữ liệu hệ thống...</div>;

  return (
    <div className="p-6 space-y-6 bg-slate-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Thống kê hệ thống</h1>
        <p className="text-slate-500">Chào mừng bạn trở lại trang quản trị.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={i} className="shadow-sm border-slate-200 rounded-[20px]">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 rounded-[24px] p-6 shadow-sm border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={20} className="text-blue-500"/> Doanh thu tuần này</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-3 rounded-[24px] p-6 shadow-sm border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Hoạt động gần đây</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 text-sm">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700">Khách hàng #{1200 + i} đã đặt phòng</p>
                  <p className="text-xs text-slate-400">{i * 5} phút trước • Chi nhánh Quận 1</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;