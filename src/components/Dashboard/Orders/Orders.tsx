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
  Filter,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import OrdersModal from "./OrdersModal";
import { useAllOrders } from "@/lib/hooks/useOrder";
import { Order, OrderAnalytics } from "@/lib/types/order";

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const limit = 5;

  const { data, isLoading, isError } = useAllOrders({
    limit: 10,
    page: currentPage,
    orderStatus: orderStatus || undefined,
    paymentType: paymentType || undefined,
  });

  const orderAnalytics: OrderAnalytics | undefined = data?.analytics;
  const orderData = data?.data || [];

  // Reset pagination when filters change
  const handleFilterChange = (type: "orderStatus" | "paymentType", value: string) => {
    if (type === "orderStatus") setOrderStatus(value);
    if (type === "paymentType") setPaymentType(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setOrderStatus("");
    setPaymentType("");
    setCurrentPage(1);
  };

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
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-black">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Order Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-200">
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {orderStatus || "All"}
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilterChange("orderStatus", "")}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange("orderStatus", "pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange("orderStatus", "delivered")}>
                    Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange("orderStatus", "cancelled")}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Payment Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-200">
                    <Filter className="w-4 h-4 mr-2" />
                    Payment: {paymentType || "All"}
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Payment</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilterChange("paymentType", "")}>
                    All Payments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange("paymentType", "cod")}>
                    COD
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange("paymentType", "online")}>
                    Online
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters Button */}
              {(orderStatus || paymentType) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Order ID</TableHead>
                    <TableHead className="whitespace-nowrap">Customer</TableHead>
                    <TableHead className="whitespace-nowrap">Products</TableHead>
                    <TableHead className="whitespace-nowrap">Amount</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Payment</TableHead>
                    <TableHead className="whitespace-nowrap text-center">Order Date</TableHead>
                    <TableHead className="whitespace-nowrap text-right">View</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((order: Order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">#{order.orderUniqueId}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {order.userId.firstName} {order.userId.lastName}
                          </span>
                          <span className="text-xs text-gray-500">{order.userId.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{order.items.length} items</TableCell>
                      <TableCell className="whitespace-nowrap font-semibold">${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize whitespace-nowrap ${
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
                      <TableCell>
                        <Badge
                          className={`capitalize whitespace-nowrap ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        {new Date(order.purchaseDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white text-black hover:bg-gray-100"
                          onClick={() => viewOrder(order)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

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
