import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, Save, Store, MapPin, Phone, Clock, 
  DollarSign, Image as ImageIcon, Tag, CheckCircle2, Upload 
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "@/services/axiosClient";
import { Shop } from "@/services/api";
import { AxiosError, AxiosResponse } from "axios";

// Labels remain static as per your previous logic
const LABEL_OPTIONS = ["Budget", "Luxury", "Student", "Family", "Dating", "Trending"];

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
  });

  const [amenityOptions, setAmenityOptions] = useState<string[]>([]); // Dynamic Amenities from BE
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. FETCH MASTER DATA (AMENITIES) AND SHOP DETAIL
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dynamic amenities from BE
        const amenityRes = await axiosClient.get("/amenities");
        const amenities = (amenityRes as AxiosResponse<string[]>).data || amenityRes;
        setAmenityOptions(Array.isArray(amenities) ? amenities : []);

        // If Edit mode, fetch Shop details
        if (isEdit && id) {
          const res = await axiosClient.get<Shop>(`/shops/${id}`);
          const shopData = (res as AxiosResponse<Shop>).data;

          setFormData({
            name: shopData.name || "",
            address: shopData.address || "",
            city: shopData.city || "",
            phoneNumber: shopData.phoneNumber || "",
            openingHours: shopData.openingHours || "",
            description: shopData.description || "",
            minPricePerHour: shopData.minPricePerHour?.toString() || "",
            imageUrl: shopData.imageUrl || "",
            amenities: shopData.amenities || [],
            labels: shopData.labels || [],
          });
          setImagePreview(shopData.imageUrl);
        }
      } catch (error) {
        toast.error("Failed to load necessary data");
        if (isEdit) navigate("/admin/shops");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit, navigate]);

  // 2. IMAGE HANDLING
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image size must be under 2MB");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
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

  // 3. SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, city, address, phoneNumber, minPricePerHour } = formData;
    if (!name || !city || !address || !phoneNumber || !minPricePerHour) {
      return toast.error("Please fill in all required fields (*)");
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        minPricePerHour: Number(formData.minPricePerHour)
      };

      if (isEdit) {
        await axiosClient.put(`/shops/${id}`, payload);
        toast.success("Shop updated successfully!");
      } else {
        await axiosClient.post("/shops", payload);
        toast.success("New shop created successfully!");
      }
      
      navigate("/admin/shops");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errMsg = axiosError.response?.data?.message || "System error, please try again";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin/shops")} className="mb-6 -ml-2 text-slate-500">
          <ChevronLeft className="mr-1 h-5 w-5" /> Back to List
        </Button>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
          <fieldset disabled={loading} className="contents">
            <div className="p-8 border-b border-slate-100 bg-white">
              <h1 className="text-2xl font-bold text-slate-900">{isEdit ? "Update Shop" : "Add New Shop"}</h1>
              <p className="text-slate-500 text-sm">This information will be displayed to customers on the booking page.</p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold"><Store size={16}/> Shop Name *</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-11" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold"><MapPin size={16}/> City *</Label>
                    <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold"><Phone size={16}/> Phone Number *</Label>
                    <Input required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="rounded-xl h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold"><MapPin size={16}/> Detailed Address *</Label>
                  <Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-xl h-11" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold"><Clock size={16}/> Operating Hours</Label>
                    <Input placeholder="08:00 - 23:00" value={formData.openingHours} onChange={e => setFormData({...formData, openingHours: e.target.value})} className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold"><DollarSign size={16}/> Min Price / hr *</Label>
                    <Input required type="number" value={formData.minPricePerHour} onChange={e => setFormData({...formData, minPricePerHour: e.target.value})} className="rounded-xl h-11" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold"><ImageIcon size={16}/> Shop Cover Image *</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all min-h-[150px] overflow-hidden relative"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img src={imagePreview} alt="Preview" className="w-full h-[120px] object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <span className="text-white text-xs font-bold">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-xs text-slate-500">Upload image from device</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-semibold"><CheckCircle2 size={16}/> Amenities</Label>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    {amenityOptions.length > 0 ? amenityOptions.map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer transition-all hover:translate-x-1">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.amenities.includes(item)}
                          onChange={() => handleToggleAmenity(item)}
                        />
                        <span className="text-sm text-slate-600">{item}</span>
                      </label>
                    )) : (
                      <span className="text-xs text-slate-400 col-span-2">No amenities found in database.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 font-semibold"><Tag size={16}/> Display Labels</Label>
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
                  <Label className="font-semibold text-slate-700">Shop Description</Label>
                  <Textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="rounded-xl min-h-[160px] resize-none border-slate-200"
                    placeholder="Briefly introduce your venue..."
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/shops")} className="flex-1 h-12 rounded-xl">Cancel</Button>
              <Button type="submit" className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-base font-bold">
                {loading ? "Processing..." : (
                  <><Save className="mr-2 h-5 w-5" /> {isEdit ? "Update Venue" : "Confirm Creation"}</>
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default ShopForm;