import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ChevronLeft, Save, Upload, LayoutGrid, Users, 
  DollarSign, CheckCircle2, Image as ImageIcon 
} from "lucide-react";
import axiosClient from "@/services/axiosClient";
import { Room } from "@/services/api";
import { AxiosResponse } from "axios";

const RoomForm = () => {
  const { shopId, roomId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(roomId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [amenityOptions, setAmenityOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", 
    capacity: "", 
    pricePerHour: "", 
    status: "AVAILABLE", 
    imageUrl: "", 
    amenities: [] as string[]
  });

  // 1. FETCH MASTER DATA (AMENITIES) & ROOM DETAIL
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dynamic amenities from Backend
        const amenityRes = await axiosClient.get("/amenities");
        const amenities_option = (amenityRes as AxiosResponse<string[]>).data || amenityRes;
        setAmenityOptions(Array.isArray(amenities_option) ? amenities_option : []);

        // Fetch Room Detail if in Edit mode
        if (isEdit && roomId) {
          const res = await axiosClient.get<Room>(`/shops/${shopId}/rooms/${roomId}`);
          const roomData = (res as AxiosResponse<Room>).data;

          setFormData({
            name: roomData.name || "",
            capacity: roomData.capacity || "",
            pricePerHour: roomData.pricePerHour?.toString() || "",
            status: roomData.status || "AVAILABLE",
            imageUrl: roomData.imageUrl || "",
            amenities: roomData.amenities || [],
          });
          setImagePreview(roomData.imageUrl);
        }
      } catch (error) {
        toast.error("Failed to load room data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roomId, isEdit]);

  // 2. IMAGE SELECTION (BASE64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("Image size must be under 2MB");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

// 3. SUBMIT FORM
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.capacity || !formData.pricePerHour) {
    return toast.error("Please fill in all required fields (*)");
  }
  if (!formData.imageUrl) return toast.warning("Please upload a room image");

  setLoading(true);
  try {
    const payload = {
      ...formData,
      pricePerHour: Number(formData.pricePerHour),
      // shopId: Number(shopId) // Có thể không cần gửi trong Body nếu đã có trên URL
    };

    if (isEdit) {
      await axiosClient.put(`/shops/${shopId}/rooms/${roomId}`, payload);
      toast.success("Room updated successfully!");
    } else {
      await axiosClient.post(`/shops/${shopId}/rooms`, payload); 
      toast.success("New room created successfully!");
    }
    
    setTimeout(() => navigate(`/admin/shops/${shopId}/rooms`), 1000);
  } catch (error) {
    toast.error("Failed to save room. Check your connection or API path.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/admin/shops/${shopId}/rooms`)} 
          className="mb-6 -ml-2 text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="mr-1 h-5 w-5" /> Back to Room List
        </Button>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
          <fieldset disabled={loading} className="contents">
            <div className="p-8 border-b border-slate-100">
              <h1 className="text-2xl font-bold text-slate-900">{isEdit ? "Edit Room" : "Add New Room"}</h1>
              <p className="text-slate-500 text-sm">Configure the specific karaoke room details for this venue.</p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold text-slate-700"><LayoutGrid size={16}/> Room Name *</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-11" placeholder="e.g. VIP Room 01" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold text-slate-700"><Users size={16}/> Capacity *</Label>
                    <Input required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="rounded-xl h-11" placeholder="e.g. 10-15 people" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold text-slate-700"><DollarSign size={16}/> Price/Hour *</Label>
                    <Input required type="number" value={formData.pricePerHour} onChange={e => setFormData({...formData, pricePerHour: e.target.value})} className="rounded-xl h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold text-slate-700"><ImageIcon size={16}/> Room Image *</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer min-h-[220px] relative transition-all group overflow-hidden"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-[180px] object-cover rounded-xl shadow-sm" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl">
                          <span className="text-white text-xs font-bold">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-slate-400 mb-2" />
                        <span className="text-xs text-slate-500 font-medium">Upload room photo from device</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold text-slate-700">
                    <CheckCircle2 size={16}/> Amenities
                  </Label>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl min-h-[235px]">
                    {amenityOptions.length > 0 ? amenityOptions.map(item => (
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
                    )) : (
                      <span className="text-xs text-slate-400 italic">No amenities available in database.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Initial Status</Label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl h-11 px-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="BOOKED">Booked</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(`/admin/shops/${shopId}/rooms`)} className="flex-1 h-12 rounded-xl font-semibold text-slate-600">
                Cancel
              </Button>
              <Button type="submit" className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100">
                <Save className="mr-2 h-5 w-5" /> 
                {loading ? "Saving..." : (isEdit ? "Update Room Info" : "Confirm Creation")}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;