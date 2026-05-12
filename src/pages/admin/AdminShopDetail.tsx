import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Pencil, Hash, MapPin, Phone, 
  Clock, Star, MessageSquare, Activity, Image as ImageIcon, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosClient from '@/services/axiosClient';
import { Shop } from '@/services/api'; // Import trực tiếp từ file api.ts của bạn
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

const AdminShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopDetail = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get<Shop>(`/shops/${id}`);
        // Xử lý ép kiểu cho an toàn theo interceptor của bạn
        const data = (res as AxiosResponse<Shop>).data || (res as unknown as Shop);
        setShop(data);
      } catch (err) {
        toast.error("Failed to load shop records from database");
      } finally {
        setLoading(false);
      }
    };
    fetchShopDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-mono text-slate-400">CONNECTING TO API...</div>;
  if (!shop) return <div className="p-10 text-center text-red-500">ERROR: Shop Data Not Found</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate('/admin/shops')} className="rounded-xl border-slate-200">
              <ChevronLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">SHOP DATA OVERVIEW</h1>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">UID: {shop.id}</span>
            </div>
          </div>
          <Button onClick={() => navigate(`/admin/shops/edit/${shop.id}`)} className="bg-blue-600 hover:bg-blue-700 rounded-xl">
            <Pencil size={16} className="mr-2" /> Modify Record
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Section */}
          <Card className="lg:col-span-2 border-slate-200 shadow-none rounded-[24px]">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-400">
                <Info size={16} /> CORE ATTRIBUTES
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DataField label="Official Name" value={shop.name} />
                <DataField label="Contact Number" value={shop.phoneNumber} />
                <DataField label="City Location" value={shop.city} />
                <DataField label="Detailed Address" value={shop.address} />
                <DataField label="Operational Hours" value={shop.openingHours} />
                <DataField label="Starting Price" value={`${shop.minPricePerHour.toLocaleString()} VND`} />
                <div className="md:col-span-2">
                  <DataField label="Technical Description" value={shop.description || "N/A"} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* Metrics Card */}
            <Card className="border-slate-200 shadow-none rounded-[24px]">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <span className="text-xs font-bold text-slate-400">STATUS</span>
                  <span className="text-[10px] font-black px-2 py-1 bg-green-100 text-green-700 rounded">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <span className="text-xs font-bold text-slate-400">RATING</span>
                  <div className="flex items-center gap-1 font-mono font-bold">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" /> {shop.rating || 0}/5.0
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">ENGAGEMENT</span>
                  <span className="font-mono font-bold">{shop.reviewCount || 0} reviews</span>
                </div>
              </CardContent>
            </Card>

            {/* Media Asset Card */}
            <Card className="border-slate-200 shadow-none rounded-[24px] overflow-hidden">
              <div className="p-4 bg-slate-100/50 border-b border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                  <ImageIcon size={12} /> COVER_RESOURCE_URL
                </span>
              </div>
              <div className="p-3">
                <img src={shop.imageUrl} className="w-full h-44 object-cover rounded-xl border border-slate-100" alt="API Asset" />
              </div>
            </Card>
          </div>
        </div>

        {/* Tags Section */}
        <Card className="border-slate-200 shadow-none rounded-[24px]">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-xs font-bold text-slate-400">COLLECTION: AMENITIES_JSON</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {shop.amenities && shop.amenities.length > 0 ? (
                shop.amenities.map((item) => (
                  <code key={item} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold">
                    "{item}"
                  </code>
                ))
              ) : (
                <span className="text-slate-300 text-xs italic font-mono">NULL_ARRAY</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sub-component for clean data rendering
const DataField = ({ label, value }: { label: string; value: string | number }) => (
  <div className="space-y-1.5">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</h4>
    <p className="text-slate-800 font-bold text-sm leading-relaxed">{value}</p>
  </div>
);

export default AdminShopDetail;