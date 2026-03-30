import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, Save, Upload, User, Mail, Phone, Lock, ShieldCheck, ImageIcon } from "lucide-react";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phoneNumber: "", role: "user", avatar: ""
  });

  useEffect(() => {
    if (isEdit) { // Mock fetch data để Edit
      const mockUser = { name: "Nguyễn Văn A", email: "vana@gmail.com", password: "", phoneNumber: "0987654321", role: "user", avatar: "" };
      setFormData(mockUser);
    }
  }, [id, isEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); setFormData({...formData, avatar: reader.result as string}); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!isEdit && !formData.password)) return toast.error("Vui lòng điền đủ các trường bắt buộc!");
    console.log("Submit User:", formData);
    toast.success(isEdit ? "Cập nhật người dùng thành công" : "Tạo tài khoản thành công");
    setTimeout(() => navigate("/admin/users"), 1200);
  };

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin/users")} className="mb-6 -ml-2 text-slate-500"><ChevronLeft className="mr-1 h-5 w-5" /> Quay lại danh sách</Button>
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100"><h1 className="text-2xl font-bold text-slate-900">{isEdit ? "Chỉnh sửa Người dùng" : "Thêm Người dùng mới"}</h1><p className="text-slate-500 text-sm">Quản lý thông tin định danh và quyền hạn của tài khoản.</p></div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
            <div className="space-y-5">
              <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><User size={16}/> Họ và tên *</Label><Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-11" placeholder="Nhập tên người dùng..." /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><Mail size={16}/> Email (Tài khoản) *</Label><Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="rounded-xl h-11" placeholder="example@gmail.com" /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><Lock size={16}/> {isEdit ? "Mật khẩu mới (Bỏ trống nếu không đổi)" : "Mật khẩu *"}</Label><Input type="password" required={!isEdit} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="rounded-xl h-11" /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><Phone size={16}/> Số điện thoại</Label><Input value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="rounded-xl h-11" /></div>
            </div>
            {/* CỘT PHẢI: AVATAR & QUYỀN */}
            <div className="space-y-6">
              <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><ImageIcon size={16}/> Ảnh đại diện</Label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-full w-40 h-40 mx-auto flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer relative transition-all overflow-hidden group">
                  {imagePreview ? <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" /> : <><Upload className="h-8 w-8 text-slate-400 mb-1" /><span className="text-[10px] text-slate-500">Tải ảnh lên</span></>}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
              </div>
              <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><ShieldCheck size={16}/> Vai trò hệ thống (Role)</Label>
                <div className="grid grid-cols-2 gap-3 p-2 bg-slate-100 rounded-2xl">
                  {['admin', 'user'].map(r => (
                    <button key={r} type="button" onClick={() => setFormData({...formData, role: r})} className={`py-2 rounded-xl text-sm font-bold transition-all ${formData.role === r ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/users")} className="flex-1 h-12 rounded-xl">Hủy bỏ</Button>
            <Button type="submit" className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 active:scale-95"><Save className="mr-2 h-5 w-5" /> {isEdit ? "Cập nhật tài khoản" : "Tạo người dùng"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;