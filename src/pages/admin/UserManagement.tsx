import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, UserPlus, Eye, Loader2 } from 'lucide-react';
import { toast } from "sonner"; 
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import axiosClient from "@/services/axiosClient";
import { AxiosResponse } from 'axios';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER'; 
  phoneNumber?: string;
  avatar?: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH DANH SÁCH USER TỪ BE
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get<UserData[]>("/users");
      const data = (res as AxiosResponse<UserData[]>).data || res;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load users from system");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. XỬ LÝ XÓA USER QUA API
  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("User record deleted successfully");
    } catch (error) {
      toast.error("Could not delete user. Access denied or server error.");
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System User Records</h1>
          <p className="text-xs text-slate-500 font-mono">Total users: {users.length}</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/users/create')} 
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          <UserPlus size={18} /> Add New User
        </Button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-bold text-[11px] uppercase text-slate-400 tracking-wider">User Details</th>
              <th className="p-4 font-bold text-[11px] uppercase text-slate-400 tracking-wider">Access Role</th>
              <th className="p-4 font-bold text-[11px] uppercase text-slate-400 tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-12 text-center text-slate-400 italic">
                  <Loader2 className="animate-spin inline-block mr-2" size={18}/> Synchronizing with API...
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden border border-slate-200">
                       {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover"/> : u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono lowercase">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                    u.role === 'ADMIN' 
                      ? 'bg-purple-50 text-purple-700 border-purple-100' 
                      : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  {/* NÚT XEM CHI TIẾT */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(`/admin/users/${u.id}`)} 
                    className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Eye size={18} />
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(`/admin/users/edit/${u.id}`)} 
                    className="text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                  >
                    <Edit size={18} />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={18} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[28px] border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">Revoke Access?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                          Account <span className="font-mono text-slate-900 font-bold underline">{u.email}</span> will be permanently removed from the SingEasy database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2 pt-4">
                        <AlertDialogCancel className="rounded-xl border-slate-200">Abort</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(u.id)} 
                          className="bg-red-600 hover:bg-red-700 rounded-xl"
                        >
                          Confirm Deletion
                        </AlertDialogAction>
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