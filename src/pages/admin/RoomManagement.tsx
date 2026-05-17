import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Room } from "@/services/api";
import axiosClient from "@/services/axiosClient";

// Cấu hình hiển thị cho các trạng thái phòng
const statusConfig = {
  AVAILABLE: {
    label: "Available",
    className: "bg-green-100 text-green-700",
  },
  BOOKED: {
    label: "Booked",
    className: "bg-orange-100 text-orange-700",
  },
  OCCUPIED: {
    label: "Occupied",
    className: "bg-red-100 text-red-700",
  },
};

const RoomManagement = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Load rooms from Backend
  const loadRooms = async () => {
    try {
      setLoading(true);
      // axiosClient đã được cấu hình interceptor để đính kèm token
      const res = await axiosClient.get<Room[]>(`/shops/${shopId}/rooms`);
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Load rooms error:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      loadRooms();
    }
  }, [shopId]);

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      await axiosClient.delete(`/shops/${shopId}/rooms/${id}`);
      setRooms(prev => prev.filter(r => r.id !== id));
      toast.success("Room deleted successfully");
    } catch (error) {
      toast.error("Failed to delete room. Check for active bookings!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/shops")}>
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold">Room Management - Shop #{shopId}</h1>
        <Button className="ml-auto" onClick={() => navigate(`/admin/shops/${shopId}/rooms/create`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Room
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price/Hour</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">Loading...</TableCell>
              </TableRow>
            ) : rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">No rooms found.</TableCell>
              </TableRow>
            ) : rooms.map((room) => {
              // Lấy config hiển thị dựa trên status (mặc định là AVAILABLE nếu status lạ)
              const config = statusConfig[room.status as keyof typeof statusConfig] || statusConfig.AVAILABLE;
              
              return (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.pricePerHour?.toLocaleString()}$</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${config.className}`}>
                      {config.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/admin/shops/${shopId}/rooms/edit/${room.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[24px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm deletion?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete <strong>{room.name}</strong>. 
                            You cannot undo this if there are no constraints.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(room.id)} 
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RoomManagement;