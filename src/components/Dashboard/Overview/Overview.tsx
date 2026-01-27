"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Renvenue from "./Renvenue";
import SalesByRegion from "./SalesByRegion";
import { useAnalytics } from "@/lib/hooks/useOverView";
import { DashboardAnalyticsApiResponse } from "@/lib/types/overall";
import { Loader2, ShoppingCart, DollarSign, Users, Truck } from "lucide-react";
import { useAllOrders } from "@/lib/hooks/useOrder";
import { Order } from "@/lib/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function Overview() {
  const { data, isLoading, isError } = useAnalytics();
  const analyticsData = (data as DashboardAnalyticsApiResponse)?.data;
  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useAllOrders({
    limit: 6,
    page: 1,
  });

  const ordersData = ordersResponse?.data || [];
  const ordersAnalytics = ordersResponse?.analytics;

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
        Error loading dashboard analytics. Please try again later.
      </div>
    );
  }

  return (
    <main className="p-6 space-y-6 bg-gray-50 min-h-screen text-black">
      {/* <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Over view */}
        <Card className="bg-white border-0 gap-3 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-lg font-medium text-gray-600">
              Total Orders
            </CardTitle>
            <ShoppingCart className="w-16 h-16 bg-[#eefbf7] text-2xl! rounded-xl p-2 text-[#34D399]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData?.totalOrder || 0}
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-white border-0 gap-3 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-lg font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-16 h-16 bg-[#eefbf7] text-2xl! rounded-xl p-2 text-[#34D399]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              ${analyticsData?.totalRevenue?.toLocaleString() || "0.00"}
            </p>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="bg-white border-0 gap-3 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Customers
            </CardTitle>
            <Users className="w-16 h-16 bg-[#eefbf7] text-2xl! p-2 rounded-xl text-[#34D399]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData?.totalCustomer || 0}
            </p>
          </CardContent>
        </Card>

        {/* Total Supplier */}
        <Card className="bg-white border-0 gap-3 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Suppliers
            </CardTitle>
            <Truck className="w-16 h-16 bg-[#eefbf7] rounded-xl text-2xl! p-2 text-[#34D399]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData?.totalSupplier || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Renvenue />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <SalesByRegion />
        </div>
      </div>
      <div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              View All
            </Link>
          </div>

          <Card className="bg-white border-0 shadow-sm overflow-hidden text-black">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
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
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Date
                  </TableHead>
                  {/* <TableHead className="font-semibold text-gray-700">
                    Actions
                  </TableHead> */}
                </TableRow>
              </TableHeader>

              <TableBody>
                {ordersLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : ordersData.length > 0 ? (
                  ordersData.slice(0, 5).map((order: Order) => (
                    <TableRow
                      key={order._id}
                      className="bg-white hover:bg-gray-50/50 transition-colors border-b border-gray-100"
                    >
                      {/* Order ID */}
                      <TableCell>
                        <span className="font-mono text-sm text-gray-600">
                          #{order.orderUniqueId}
                        </span>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {order.userId.firstName} {order.userId.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.userId.email}
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell>
                        <span className="font-semibold text-gray-900">
                          ${order.totalPrice?.toFixed(2) || "0.00"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={`capitalize ${
                            order.orderStatus === "delivered"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : order.orderStatus === "pending"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(order.purchaseDate).toLocaleDateString()}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      {/* <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-full border text-secondary-foreground hover:text-secondary-foreground/90 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" /> View
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-gray-500"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-10 lg:grid-cols-4 gap-4">
          {/* Total Orders */}
          <Card className="py-2 rounded-[13.734px] border border-[rgba(233,236,239,0.5)] bg-[#F7F9F9] bg-[linear-gradient(135deg,rgba(8,102,70,0.05)_0%,rgba(0,0,0,0)_100%)] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#086646] text-white p-2">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-medium text-gray-600">
                <span>Total Orders</span>
                <p className="text-xl font-bold text-gray-900 ml-1">
                  {analyticsData?.totalOrder || 0}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2"></CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="py-2 rounded-[13.734px] border border-[rgba(233,236,239,0.5)] bg-[#F7F9F9] bg-[linear-gradient(135deg,rgba(8,102,70,0.05)_0%,rgba(0,0,0,0)_100%)] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0d9488] text-white p-2">
                <DollarSign className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-medium text-gray-600">
                <span>Total Revenue</span>
                <p className="text-xl font-bold text-gray-900 ml-1">
                  ${analyticsData?.totalRevenue?.toLocaleString() || "0.00"}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2"></CardContent>
          </Card>

          {/* Total Customers */}
          <Card className="py-2 rounded-[13.734px] border border-[rgba(233,236,239,0.5)] bg-[#F7F9F9] bg-[linear-gradient(135deg,rgba(8,102,70,0.05)_0%,rgba(0,0,0,0)_100%)] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#3b82f6] text-white p-2">
                <Users className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-medium text-gray-600">
                <span>Total Customers</span>
                <p className="text-xl font-bold text-gray-900 ml-1">
                  {analyticsData?.totalCustomer || 0}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2"></CardContent>
          </Card>

          {/* Total Supplier */}
          <Card className="py-2 rounded-[13.734px] border border-[rgba(233,236,239,0.5)] bg-[#F7F9F9] bg-[linear-gradient(135deg,rgba(8,102,70,0.05)_0%,rgba(0,0,0,0)_100%)] shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f97316] text-white p-2">
                <Truck className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-medium text-gray-600">
                <span>Total Suppliers</span>
                <p className="text-xl font-bold text-gray-900 ml-1">
                  {analyticsData?.totalSupplier || 0}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2"></CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
