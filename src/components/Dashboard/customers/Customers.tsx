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
  ChevronDown,
  Loader2,
} from "lucide-react";

import { useAllOrders } from "@/lib/hooks/useOrder";
import { Order, OrderAnalytics } from "@/lib/types/order";
import CustomerModal from "./CustomerModal";

export default function Customers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const limit = 5;

  const { data, isLoading, isError } = useAllOrders({
    limit: 1000, // Fetch a large number for manual pagination
  });

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

  const handleView = (order: Order) => {
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
            Customer Management
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage customer accounts (derived from orders)
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
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
                Delivered Orders
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
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Orders
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
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Order ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Total Spent
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Order Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    className="bg-white hover:bg-gray-50/50 transition-colors border-b border-gray-100"
                  >
                    {/* 1. Customer */}
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {order.userId.firstName} {order.userId.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userId.email}
                      </div>
                    </TableCell>

                    {/* 2. Contact */}
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {order.billingInfo.phone || "N/A"}
                      </div>
                    </TableCell>

                    {/* 3. Order ID */}
                    <TableCell>
                      <span className="font-mono text-sm text-gray-600">
                        #{order.orderUniqueId}
                      </span>
                    </TableCell>

                    {/* 4. Amount */}
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </TableCell>

                    {/* 5. Payment Status */}
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>

                    {/* 6. Date */}
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(order.purchaseDate).toLocaleDateString()}
                      </div>
                    </TableCell>

                    {/* 7. Actions */}
                    <TableCell className="text-center">
                      <Button
                        onClick={() => handleView(order)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
        <CustomerModal
          modalOpen={modalOpen}
          onModalChange={setModalOpen}
          data={selectedOrder}
        />
      </div>
    </main>
  );
}

