import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, DoorOpen, Users, CalendarCheck } from "lucide-react";

const AdminDashboard = () => {
  // Sau này những số liệu này sẽ được fetch từ API
  const stats = [
    {
      title: "Tổng số Shop",
      value: "12",
      icon: <Store className="h-5 w-5 text-blue-600" />,
      description: "2 shop mới trong tháng này",
    },
    {
      title: "Tổng số Phòng",
      value: "156",
      icon: <DoorOpen className="h-5 w-5 text-green-600" />,
      description: "85% công suất hoạt động",
    },
    {
      title: "Người dùng",
      value: "1,240",
      icon: <Users className="h-5 w-5 text-purple-600" />,
      description: "+12% so với tháng trước",
    },
    {
      title: "Đơn đặt phòng",
      value: "48",
      icon: <CalendarCheck className="h-5 w-5 text-orange-600" />,
      description: "Đang chờ xử lý hôm nay",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Thống kê hệ thống
        </h1>
        <p className="text-slate-500">Chào mừng bạn trở lại trang quản trị.</p>
      </div>

      {/* Grid hiển thị các con số */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bạn có thể thêm biểu đồ hoặc danh sách đơn hàng gần đây ở dưới này */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 p-6">
          <h3 className="font-semibold mb-4">Biểu đồ doanh thu (Mẫu)</h3>
          <div className="h-[200px] flex items-center justify-center bg-slate-50 border border-dashed rounded-lg text-slate-400 text-sm">
             [Khu vực hiển thị Chart sau khi cài Recharts]
          </div>
        </Card>
        
        <Card className="col-span-3 p-6">
          <h3 className="font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                <div className="flex-1">
                   <p className="font-medium text-slate-800">User #12{i} đã đặt phòng</p>
                   <p className="text-xs text-slate-500">10 phút trước</p>
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