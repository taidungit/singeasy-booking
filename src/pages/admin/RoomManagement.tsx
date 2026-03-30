import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const RoomManagement = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState([
    { id: "101", name: "Phòng VIP 01", type: "VIP", price: 300000, status: "Trống" },
    { id: "102", name: "Phòng Thường 05", type: "Standard", price: 150000, status: "Đang hát" },
  ]);

  const handleDelete = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
    toast.success("Đã xóa phòng thành công");
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/shops")}><ChevronLeft /></Button>
        <h1 className="text-2xl font-bold">Quản lý Phòng - Shop #{shopId}</h1>
        <Button className="ml-auto" onClick={() => navigate(`/admin/shops/${shopId}/rooms/create`)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Phòng mới
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Phòng</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá/Giờ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{room.price.toLocaleString()}đ</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${room.status === "Trống" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {room.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/shops/${shopId}/rooms/edit/${room.id}`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[24px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa phòng?</AlertDialogTitle>
                        <AlertDialogDescription>Hành động này sẽ xóa vĩnh viễn {room.name}.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(room.id)} className="bg-red-600 hover:bg-red-700 rounded-xl">Xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RoomManagement;