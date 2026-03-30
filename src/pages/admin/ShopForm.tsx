import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save, Store, MapPin, Phone, Clock, DollarSign, Image as ImageIcon, Tag, CheckCircle2, Upload, X } from "lucide-react";
import { toast } from "sonner";
const AMENITY_OPTIONS = ["Wifi", "Điều hòa", "Bãi đỗ xe", "Thang máy", "Dàn âm thanh JBL", "Phòng VIP", "Máy chiếu", "Phục vụ đồ ăn"];
const LABEL_OPTIONS = ["Giá rẻ", "Sang trọng", "Sinh viên", "Gia đình", "Hẹn hò", "Nổi bật"];
// Định nghĩa Highlights mặc định
const DEFAULT_HIGHLIGHTS = ["Âm thanh cực đỉnh", "Phòng sạch sẽ", "Phục vụ tận tâm"];

const ShopForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phoneNumber: "",
    openingHours: "",
    description: "",
    minPricePerHour: "",
    imageUrl: "",
    amenities: [] as string[],
    labels: [] as string[],
    highlights: [...DEFAULT_HIGHLIGHTS], // Gán Highlights mặc định
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      // Giả lập Fetch data
      const mockData = {
        name: "SingEasy Luxury",
        address: "123 Quận 1",
        city: "Hồ Chí Minh",
        phoneNumber: "0901234567",
        openingHours: "08:00 - 23:30",
        description: "Hệ thống karaoke cao cấp.",
        minPricePerHour: "200000",
        imageUrl: "https://example.com/image.jpg",
        amenities: ["Wifi", "Điều hòa", "Phòng VIP"],
        labels: ["Sang trọng"],
        highlights: ["Âm thanh cực đỉnh", "Phòng sạch sẽ", "Phục vụ tận tâm"],
      };
      setFormData(mockData);
      setImagePreview(mockData.imageUrl);
    }
  }, [id, isEdit]);

  // Hàm xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleAmenity = (item: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter(i => i !== item)
        : [...prev.amenities, item]
    }));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const { name, city, address, phoneNumber, imageUrl } = formData;
  if (!name || !city || !address || !phoneNumber) return toast.error("Thiếu thông tin bắt buộc (*)");
  if (!imageUrl) return toast.warning("Vui lòng tải ảnh đại diện");
  console.log("Submit:", formData);
  toast.success(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
  setTimeout(() => navigate("/admin/shops"), 1200);
};

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin/shops")} className="mb-6 -ml-2 text-slate-500">
          <ChevronLeft className="mr-1 h-5 w-5" /> Quay lại danh sách
        </Button>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-white">
            <h1 className="text-2xl font-bold text-slate-900">{isEdit ? "Cập nhật Shop" : "Thêm Shop mới"}</h1>
            <p className="text-slate-500 text-sm">Thông tin này sẽ hiển thị trực tiếp cho khách hàng đặt phòng.</p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold"><Store size={16}/> Tên quán *</Label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-11" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold"><MapPin size={16}/> Thành phố *</Label>
                  <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold"><Phone size={16}/> Số điện thoại *</Label>
                  <Input required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="rounded-xl h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold"><MapPin size={16}/> Địa chỉ chi tiết *</Label>
                <Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-xl h-11" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold"><Clock size={16}/> Giờ hoạt động</Label>
                  <Input placeholder="08:00 - 23:00" value={formData.openingHours} onChange={e => setFormData({...formData, openingHours: e.target.value})} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold"><DollarSign size={16}/> Giá thấp nhất / h *</Label>
                  <Input required type="number" value={formData.minPricePerHour} onChange={e => setFormData({...formData, minPricePerHour: e.target.value})} className="rounded-xl h-11" />
                </div>
              </div>
              
              {/* THAY ĐỔI: Chỗ chọn ảnh đại diện */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold"><ImageIcon size={16}/> Ảnh đại diện quán *</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all min-h-[150px] overflow-hidden relative"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-[120px] object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                        <span className="text-white text-xs font-bold">Thay đổi ảnh</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500">Tải ảnh lên từ máy</span>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 font-semibold"><CheckCircle2 size={16}/> Tiện ích (Amenities)</Label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  {AMENITY_OPTIONS.map(item => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer transition-all hover:translate-x-1">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={formData.amenities.includes(item)}
                        onChange={() => handleToggleAmenity(item)}
                      />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 font-semibold"><Tag size={16}/> Nhãn hiển thị (Labels)</Label>
                <div className="flex flex-wrap gap-2">
                  {LABEL_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        labels: prev.labels.includes(tag) ? prev.labels.filter(t => t !== tag) : [...prev.labels, tag]
                      }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        formData.labels.includes(tag) 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-blue-400"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Mô tả quán</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="rounded-xl min-h-[160px] resize-none border-slate-200"
                  placeholder="Giới thiệu đôi nét về quán..."
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/shops")} className="flex-1 h-12 rounded-xl">Hủy bỏ</Button>
            <Button type="submit" className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-base font-bold">
              <Save className="mr-2 h-5 w-5" /> {isEdit ? "Cập nhật Shop" : "Xác nhận tạo mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopForm;