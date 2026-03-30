import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, UserPlus, Search, Shield, User, Lock, Unlock } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'banned';
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);

  // Giả lập lấy data từ API
  useEffect(() => {
    const mockData: UserData[] = [
      { id: 1, name: "Admin SingEasy", email: "admin@singeasy.com", role: 'admin', status: 'active' },
      { id: 2, name: "Nguyễn Văn A", email: "vana@gmail.com", role: 'user', status: 'active' },
    ];
    setUsers(mockData);
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Người dùng</h1>
        {/* NÚT THÊM MỚI: Điều hướng sang trang AdminUser trống */}
        <button 
          onClick={() => navigate('/admin/users/create')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md"
        >
          <UserPlus size={18} /> Thêm Người dùng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Người dùng</th>
              <th className="p-4 font-semibold text-slate-600">Vai trò</th>
              <th className="p-4 font-semibold text-slate-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-none hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-medium text-slate-800">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  {/* NÚT SỬA: Điều hướng kèm theo ID để AdminUser biết là đang Edit */}
                  <button 
                    onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                    <Trash2 size={18} />
                  </button>
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