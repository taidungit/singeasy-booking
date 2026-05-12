import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Pencil, User as UserIcon, Mail,Phone, ShieldCheck, IdCard, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosClient from '@/services/axiosClient';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  role: 'ADMIN' | 'USER';
}

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get<User>(`/users/${id}`);
        // Xử lý response theo interceptor của bạn
        const data = (res as AxiosResponse<User>).data || res;
        setUser(res.data);
      } catch (err) {
        toast.error("Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-mono text-slate-400">LOADING PROFILE...</div>;
  if (!user) return <div className="p-10 text-center text-red-500 font-bold">404: USER_NOT_FOUND</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/admin/users')} 
              className="rounded-xl border-slate-200 bg-white"
            >
              <ChevronLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">User Profile</h1>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest">ID: {user.id}</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate(`/admin/users/edit/${user.id}`)} 
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 shadow-lg shadow-blue-100"
          >
            <Pencil size={16} className="mr-2" /> Edit Records
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Avatar & Role Card */}
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
            <div className="bg-slate-900 p-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-[40px] bg-white p-1 shadow-2xl">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-[36px]" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 rounded-[36px] flex items-center justify-center text-slate-400">
                      <UserIcon size={48} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full border-4 border-slate-900">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              </div>
              <h2 className="mt-6 text-xl font-bold text-white text-center line-clamp-1">{user.name}</h2>
              <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                user.role === 'ADMIN' 
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {user.role}
              </span>
            </div>
            <CardContent className="p-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Account Status</span>
                    <span className="text-[11px] font-bold text-green-600">VERIFIED</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">System Class</span>
                    <span className="text-xs font-bold text-slate-700">{user.role === 'ADMIN' ? 'Root Admin' : 'Standard'}</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Detailed Data Section */}
          <Card className="md:col-span-2 border-none shadow-sm rounded-[32px] bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-sm font-black text-slate-400 flex items-center gap-2">
                <IdCard size={18} /> INFORMATION ATTRIBUTES
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
                <DataPoint icon={<UserIcon size={14}/>} label="Full Name" value={user.name} />
                <DataPoint icon={<Mail size={14}/>} label="Email Address" value={user.email} />
                <DataPoint icon={<Phone size={14}/>} label="Contact Phone" value={user.phoneNumber || "NOT_PROVIDED"} />
                <DataPoint 
                  icon={<ShieldCheck size={14}/>} 
                  label="System Role" 
                  value={user.role} 
                  isMono 
                />
              </div>

              {/* Giao diện sẽ trống trải và sạch hơn khi bỏ phần Raw Avatar */}
              <div className="pt-10 border-t border-slate-50">
                 <p className="text-[11px] text-slate-400 italic">
                   Note: System logs and booking history for this user are available in the audit section.
                 </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

const DataPoint = ({ label, value, icon, isMono = false }: { label: string; value: string; icon: React.ReactNode; isMono?: boolean }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-slate-800 font-bold ${isMono ? 'font-mono text-[13px] bg-slate-50 border border-slate-100 w-fit px-3 py-1 rounded-lg' : 'text-base'}`}>
      {value}
    </p>
  </div>
);

export default AdminUserDetail;