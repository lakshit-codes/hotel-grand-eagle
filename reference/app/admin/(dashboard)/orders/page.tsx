"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchOrders, selectAdminOrders, selectAdminOrdersLoading } from "@/lib/store/features/adminOrdersSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAdminOrders);
  const loading = useAppSelector(selectAdminOrdersLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track customer purchases.</p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((ord) => (
                <TableRow key={ord._id}>
                  <TableCell className="font-medium">{ord.orderNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{ord.customer?.name}</span>
                      <span className="text-xs text-muted-foreground">{ord.customer?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ord.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {ord.status}
                    </span>
                  </TableCell>
                  <TableCell>${ord.total}</TableCell>
                  <TableCell>{new Date(ord.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
