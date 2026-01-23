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

import { useAllOrders } from "@/lib/hooks/useOrder";
import { Order, OrderAnalytics } from "@/lib/types/order";

export default function Payments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const limit = 5;

  const { data, isLoading, isError } = useAllOrders({
    limit: 1000, // Fetch a large number for manual pagination
  });
  console.log("order data", data);
  const orderAnalytics: OrderAnalytics | undefined = data?.analytics;
  const orderData = data?.data || [];

  // Manual Pagination Logic
  const totalItems = orderData.length;
  const totalPage = Math.ceil(totalItems / limit);
  const paginatedData = orderData.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
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
            Payment & Transactions
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor payments and financial transactions
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today&apos;s Revenue
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
                Completed Payments
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
                Pending Payments
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
                Failed Payments
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
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">
                    Transaction ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Order ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Payment Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Order Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                  >
                    {/* 1. Transaction ID */}
                    <TableCell>
                      #{order?.transactionId || order.orderUniqueId}
                    </TableCell>

                    {/* 2. Order ID */}
                    <TableCell>#{order.orderUniqueId}</TableCell>

                    {/* 3. Customer */}
                    <TableCell>
                      {order.userId.firstName} {order.userId.lastName}
                      <br />
                      <span className="text-sm text-gray-500">
                        {order.userId.email}
                      </span>
                    </TableCell>

                    {/* 4. Amount */}
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>

                    {/* 5. Payment Status */}
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>

                    {/* 6. Order Status */}
                    <TableCell>
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
                    </TableCell>

                    {/* 7. Date */}
                    <TableCell className="text-center">
                      {new Date(order.purchaseDate).toLocaleDateString()}
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
    </main>
  );
}
