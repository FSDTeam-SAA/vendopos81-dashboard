"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Trash2,
  MoreVertical,
  Star,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Loader2,
  XCircle,
  CheckCircle,
} from "lucide-react";
import OrdersModal from "./OrdersModal";
import { useAllOrders } from "@/lib/hooks/useOrder";
import { Order, OrderAnalytics } from "@/lib/types/order";


export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const limit = 5;

  const { data, isLoading, isError } = useAllOrders({
    limit: 1000 // Fetch a large number for manual pagination
  });
 console.log('order data',data)
  const orderAnalytics: OrderAnalytics | undefined = data?.analytics;
  const orderData = data?.data || [];
  
  // Manual Pagination Logic
  const totalItems = orderData.length;
  const totalPage = Math.ceil(totalItems / limit);
  const paginatedData = orderData.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading orders. Please try again later.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto container space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor customer orders
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {orderAnalytics?.totalOrder || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-teal-600">
                Total Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-teal-600">
                {orderAnalytics?.totalDeliveredOrder || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-600">
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">
                {orderAnalytics?.totalPendingOrder || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                ${orderAnalytics?.totalSalesAmount?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 border cursor-pointer"
            >
              Sort by <ChevronDown />
            </Button>
          </div>

          <Card className="bg-white border-0 shadow-sm overflow-hidden text-black">
            <Table>
              <TableBody>
                {paginatedData.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    className="
                      bg-white rounded-xl shadow-sm border border-gray-200
                      hover:shadow-md transition
                      block my-3
                    "
                  >
                    <TableCell className="block px-6 py-4">
                      <div className="grid grid-cols-7 items-center gap-4">
                        {/* Order ID */}
                        <div className="text-sm font-medium text-gray-700">
                          #{order.orderUniqueId}
                        </div>

                        {/* User */}
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.userId.firstName} {order.userId.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.userId.email}
                          </p>
                        </div>

                        {/* Items count */}
                        <div className="text-sm text-gray-700">
                          {order.items.length} items
                        </div>

                        {/* Total Price */}
                        <div className="font-semibold text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </div>

                        {/* Payment Status */}
                        <div>
                          <Badge
                            className={`capitalize ${
                              order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>

                        {/* Order Status */}
                        <div>
                          <Badge
                            className={`capitalize ${
                              order.orderStatus === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.orderStatus}
                          </Badge>
                        </div>

                        {/* Date + View */}
                        <div className="flex items-center justify-end gap-4">
                          <span className="text-sm text-gray-500">
                            {new Date(order.purchaseDate).toLocaleDateString()}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white text-black hover:bg-gray-100"
                            onClick={() => viewOrder(order)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {totalPage > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900 bg-transparent"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ←
              </Button>
              {Array.from({ length: totalPage }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={
                      currentPage === page
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "text-gray-600 bg-transparent"
                    }
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900 bg-transparent"
                onClick={() =>
                  handlePageChange(Math.min(totalPage, currentPage + 1))
                }
                disabled={currentPage === totalPage}
              >
                →
              </Button>
            </div>
          )}
        </div>
      </div>
      <OrdersModal
        modalOpen={modalOpen}
        onModalChange={setModalOpen}
        data={selectedOrder}
      />
    </main>
  );
}
 