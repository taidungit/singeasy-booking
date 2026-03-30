import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, DoorOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner" 
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
const ShopManagement = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([
    { id: "1", name: "SingEasy Luxury", address: "123 Quận 1", phone: "0901234567" },
    { id: "2", name: "Karaoke Gia Đình", address: "456 Quận 7", phone: "0907654321" },
  ]);
  const handleDelete = (id: string) => {
    setShops(shops.filter(s => s.id !== id));
    toast.success("Đã xóa shop thành công");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Karaoke Shops</h1>
        <Button onClick={() => navigate("/admin/shops/create")}>
          <Plus className="mr-2 h-4 w-4" /> Thêm Shop mới
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Shop</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell>{shop.address}</TableCell>
                <TableCell>{shop.phone}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/shops/${shop.id}/rooms`}>
                      <DoorOpen className="h-4 w-4 mr-1" /> Phòng
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/shops/edit/${shop.id}`)}>
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
                          <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                          <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(shop.id)} className="bg-red-600 hover:bg-red-700 rounded-xl">Xóa</AlertDialogAction>
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

export default ShopManagement;