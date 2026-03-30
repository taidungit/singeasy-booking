import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { toast } from "sonner"; // Đổi sang sonner để dùng được .success
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success("Đã xóa tài khoản thành công");
  };

  useEffect(() => {
    setUsers([
      { id: 1, name: "Admin SingEasy", email: "admin@singeasy.com", role: 'admin' },
      { id: 2, name: "Nguyễn Văn A", email: "vana@gmail.com", role: 'user' },
    ]);
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Người dùng</h1>
        <Button onClick={() => navigate('/admin/users/create')} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 flex items-center gap-2">
          <UserPlus size={18} /> Thêm Người dùng
        </Button>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Người dùng</th>
              <th className="p-4 font-semibold text-slate-600">Vai trò</th>
              <th className="p-4 font-semibold text-slate-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-none hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{u.name}</div>
                  <div className="text-xs text-slate-400 font-medium">{u.email}</div>
                </td>
                <td className="p-4">
                <span className={`inline-block w-[60px] text-center py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-200 text-purple-800' : 'bg-slate-200 text-slate-800'}`}>{u.role}</span>
                </td>
                <td className="p-4 flex justify-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/users/edit/${u.id}`)} className="text-blue-500 hover:bg-blue-50">
                    <Edit size={18} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50"><Trash2 size={18} /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[24px] border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                        <AlertDialogDescription>Tài khoản <span className="font-bold text-slate-900">{u.email}</span> sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl border-slate-200">Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(u.id)} className="bg-red-600 hover:bg-red-700 rounded-xl">Xác nhận xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;