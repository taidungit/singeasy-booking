import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// Thêm icon CalendarDays để đại diện cho phần Booking
import { Plus, Pencil, Trash2, DoorOpen, Eye, CalendarDays } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import axiosClient from "@/services/axiosClient";
import { Shop } from "@/services/api";

const ShopManagement = () => {
  const navigate = useNavigate();

  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const loadShops = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/shops");
      setShops(res.data);
    } catch (err) {
      toast.error("Failed to load shop list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axiosClient.delete(`/shops/${id}`);
      toast.success("Shop deleted successfully");
      loadShops();
    } catch (err) {
      toast.error("Error while deleting shop");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Karaoke Shop Management</h1>

        <Button onClick={() => navigate("/admin/shops/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Shop
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="font-medium">{shop.name}</TableCell>
                  <TableCell>{shop.address}</TableCell>
                  <TableCell>{shop.phoneNumber}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      {/* Nút Booking mới: Dẫn tới trang quản lý booking của riêng Shop này */}
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50" asChild>
                        <Link to={`/admin/bookings?shopId=${shop.id}`}>
                          <CalendarDays className="h-4 w-4 mr-1" />
                          Booking
                        </Link>
                      </Button>

                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/shops/${shop.id}/rooms`}>
                          <DoorOpen className="h-4 w-4 mr-1" />
                          Room
                        </Link>
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/shops/${shop.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/shops/edit/${shop.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-[24px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm deletion?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone and will remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(shop.id)}
                              className="bg-red-600 hover:bg-red-700 rounded-xl"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShopManagement;