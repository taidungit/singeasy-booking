import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, Save, Upload, User, Mail, Phone, Lock, ShieldCheck, ImageIcon, Loader2 } from "lucide-react";
import axiosClient from "@/services/axiosClient";
import { AxiosResponse } from "axios";

// Interface khớp với UserResDto và UserReqDto của BE
interface UserFormData {
  name: string;
  email: string;
  password?: string; // Optional khi Edit
  phoneNumber: string;
  role: "ADMIN" | "USER"; 
  avatar: string;
}

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "", 
    email: "", 
    password: "", 
    phoneNumber: "", 
    role: "USER", 
    avatar: ""
  });

  // 1. FETCH DATA KHI TRONG CHẾ ĐỘ EDIT
  useEffect(() => {
    const fetchUser = async () => {
      if (isEdit && id) {
        try {
          setLoading(true);
          const res = await axiosClient.get<UserFormData>(`/users/${id}`);
          const data = "data" in res ? res.data : res;
          
          setFormData({
            name: data.name || "",
            email: data.email || "",
            password: "", // Không bao giờ load password cũ về client
            phoneNumber: data.phoneNumber || "",
            role: data.role || "USER",
            avatar: data.avatar || ""
          });
          setImagePreview(data.avatar || null);
        } catch (error) {
          toast.error("Failed to load user data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [id, isEdit]);

  // 2. XỬ LÝ CHỌN ẢNH (BASE64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. SUBMIT FORM (CREATE HOẶC UPDATE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation cơ bản
    if (!formData.name || !formData.email) return toast.error("Name and Email are required!");
    if (!isEdit && !formData.password) return toast.error("Password is required for new accounts!");

    setLoading(true);
    try {
      if (isEdit) {
        // UPDATE: PUT /api/v1/users/{id}
        await axiosClient.put(`/users/${id}`, formData);
        toast.success("User updated successfully");
      } else {
        // CREATE: POST /api/v1/users
        await axiosClient.post("/users", formData);
        toast.success("New user created successfully");
      }
      setTimeout(() => navigate("/admin/users"), 1000);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred while saving";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/users")} 
          className="mb-6 -ml-2 text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="mr-1 h-5 w-5" /> Back to User List
        </Button>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
          <fieldset disabled={loading} className="contents">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h1 className="text-2xl font-bold text-slate-900">{isEdit ? "Edit User Account" : "Identity Provisioning"}</h1>
              <p className="text-slate-500 text-sm">Configure credentials and system access levels.</p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* LEFT COLUMN: PERSONAL INFO */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-wider"><User size={14}/> Full Name *</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-11 border-slate-200 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-wider"><Mail size={14}/> Email Address *</Label>
                  <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="rounded-xl h-11 border-slate-200" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-wider"><Lock size={14}/> {isEdit ? "Change Password (Optional)" : "Security Password *"}</Label>
                  <Input type="password" required={!isEdit} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="rounded-xl h-11 border-slate-200" />
                  {isEdit && <p className="text-[10px] text-slate-400 italic">Leave empty to keep existing password</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-wider"><Phone size={14}/> Phone Number</Label>
                  <Input value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="rounded-xl h-11 border-slate-200" placeholder="09xx xxx xxx" />
                </div>
              </div>

              {/* RIGHT COLUMN: AVATAR & ROLE */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-wider"><ImageIcon size={14}/> Profile Image</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="border-2 border-dashed border-slate-200 rounded-[2rem] w-44 h-44 mx-auto flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer relative transition-all overflow-hidden group shadow-inner"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-300 mb-1" />
                        <span className="text-[10px] font-bold text-slate-400">UPLOAD PHOTO</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-wider"><ShieldCheck size={14}/> Access Authorization</Label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                    {(['ADMIN', 'USER'] as const).map(r => (
                      <button 
                        key={r} 
                        type="button" 
                        onClick={() => setFormData({...formData, role: r})} 
                        className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                          formData.role === r 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/users")} className="flex-1 h-12 rounded-xl font-bold border-slate-200">
                Discard Changes
              </Button>
              <Button 
                type="submit" 
                className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                {isEdit ? "SYNCHRONIZE DATA" : "PROVISION ACCOUNT"}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default UserForm;