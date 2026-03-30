import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, Save, Upload, LayoutGrid, Users, DollarSign, CheckCircle2, Image as ImageIcon } from "lucide-react";

const AMENITY_OPTIONS = ["Máy lạnh", "Hệ thống loa JBL", "Màn hình 4K", "Micro không dây", "Sân khấu nhỏ", "Đèn laser", "Ghế sofa da"];

const RoomForm = () => {
  const { shopId, roomId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(roomId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", capacity: "", pricePerHour: "", status: "Available", imageUrl: "", amenities: [] as string[]
  });

  useEffect(() => {
    if (isEdit) {
      const mockRoom = { name: "Phòng VIP 01", capacity: "10-15", pricePerHour: "300000", status: "Available", imageUrl: "https://example.com/room.jpg", amenities: ["Máy lạnh", "Hệ thống loa JBL"] };
      setFormData(mockRoom); setImagePreview(mockRoom.imageUrl);
    }
  }, [roomId, isEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); setFormData({...formData, imageUrl: reader.result as string}); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity || !formData.pricePerHour) return toast.error("Thiếu thông tin bắt buộc (*)");
    if (!formData.imageUrl) return toast.warning("Vui lòng tải ảnh phòng");
    console.log("Submit Room:", { ...formData, shop: { id: shopId } });
    toast.success(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
    setTimeout(() => navigate(`/admin/shops/${shopId}/rooms`), 1200);
  };

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(`/admin/shops/${shopId}/rooms`)} className="mb-6 -ml-2 text-slate-500 hover:text-slate-900 transition-all"><ChevronLeft className="mr-1 h-5 w-5" /> Quay lại danh sách phòng</Button>
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100"><h1 className="text-2xl font-bold text-slate-900">{isEdit ? "Chỉnh sửa Phòng" : "Thêm Phòng mới"}</h1><p className="text-slate-500 text-sm">Thiết lập chi tiết phòng hát cho cơ sở này.</p></div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* CỘT TRÁI */}
            <div className="space-y-6">
              <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><LayoutGrid size={16}/> Tên phòng *</Label><Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-11 border-slate-200" placeholder="VD: Phòng VIP 01..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><Users size={16}/> Sức chứa *</Label><Input required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="rounded-xl h-11 border-slate-200" placeholder="VD: 10-15 người" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><DollarSign size={16}/> Giá/Giờ *</Label><Input required type="number" value={formData.pricePerHour} onChange={e => setFormData({...formData, pricePerHour: e.target.value})} className="rounded-xl h-11 border-slate-200" /></div>
              </div>
              <div className="space-y-2"><Label className="flex items-center gap-2 font-semibold text-slate-700"><ImageIcon size={16}/> Ảnh phòng *</Label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer min-h-[220px] relative transition-all overflow-hidden group">
                  {imagePreview ? <><img src={imagePreview} alt="Preview" className="w-full h-[180px] object-cover rounded-xl shadow-sm" /><div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl"><span className="text-white text-xs font-bold">Thay đổi ảnh</span></div></> : <><Upload className="h-10 w-10 text-slate-400 mb-2" /><span className="text-xs text-slate-500 font-medium">Tải ảnh phòng từ máy</span></>}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
              </div>
            </div>
            {/* CỘT PHẢI */}
            <div className="space-y-6">
            <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-slate-700">
                    <CheckCircle2 size={16}/> Tiện nghi (Amenities)
                </Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl min-h-[235px]">
                    {AMENITY_OPTIONS.map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group h-fit">
                        <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        checked={formData.amenities.includes(item)} 
                        onChange={() => setFormData(prev => ({ 
                            ...prev, 
                            amenities: prev.amenities.includes(item) ? prev.amenities.filter(i => i !== item) : [...prev.amenities, item] 
                        }))} 
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {item}
                        </span>
                    </label>
                    ))}
                </div>
                </div>
              <div className="space-y-2"><Label className="font-semibold text-slate-700">Trạng thái mặc định</Label>
                <select className="w-full border border-slate-200 rounded-xl h-11 px-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Available">Trống (Sẵn sàng)</option><option value="Occupied">Đang có khách</option><option value="Maintenance">Đã được cọc</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(`/admin/shops/${shopId}/rooms`)} className="flex-1 h-12 rounded-xl border-slate-200 font-semibold text-slate-600">Hủy bỏ</Button>
            <Button type="submit" className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"><Save className="mr-2 h-5 w-5" /> Lưu thông tin phòng</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;