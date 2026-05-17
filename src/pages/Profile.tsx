import { useState, useRef } from "react";
import { useAuth, User } from "@/context/AuthContext";
import { updateProfile } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, CheckCircle2, User as UserIcon, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { state: authState, updateUser } = useAuth();
  const [name, setName] = useState(authState.user?.name || "");
  const [phone, setPhone] = useState(authState.user?.phoneNumber || "");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(authState.user?.avatar || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🌟 Biến đổi File ảnh thành chuỗi Base64 bằng FileReader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarBase64(base64String); // Lưu chuỗi base64 vào state để preview và gửi API
      };
    }
  };
const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
    const updatedUserRes = await updateProfile(name, phone, avatarBase64);
    
    // 🌟 Gọi hàm updateUser truyền dữ liệu mới nhận được từ Backend vào đây
    updateUser(updatedUserRes as User); 

    setMessage({ type: "success", text: "Profile updated successfully!" });
    setTimeout(() => {navigate(-1);}, 1200); // Chờ 1.2 giây rồi trang Profile sẽ tự động biến mất
    } catch (error) {
      console.error("Update profile error:", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personal Information</h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Update your account profile</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-2 border ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
          }`}>
            {message.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vòng tròn Avatar chọn file */}
          <div className="flex flex-col items-center justify-center gap-2 mb-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full border-2 border-slate-100 shadow-sm overflow-hidden bg-slate-100 flex items-center justify-center">
                {avatarBase64 ? (
                  <img src={avatarBase64} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 font-black text-3xl uppercase">{name.charAt(0)}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Click photo to upload</p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              disabled
              value={authState.user?.email || ""}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-sm font-medium cursor-not-allowed"
            />
          </div>

          {/* Button Submit */}
          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl shadow-md shadow-blue-100 mt-2"
          >
            {isUpdating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;