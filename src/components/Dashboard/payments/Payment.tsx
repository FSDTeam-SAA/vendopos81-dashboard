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
import { ChevronDown, Loader2, Filter, RotateCcw, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useAllPayments } from "@/lib/hooks/usePayment";
import { Payment, PaymentAnalytics } from "@/lib/types/payment";

export default function Payments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const limit = 10;

  const { data, isLoading, isError } = useAllPayments({
    limit,
    page: currentPage,
    status: status || undefined,
  });

  const paymentAnalytics: PaymentAnalytics | undefined = data?.analytics;
  const paymentData: Payment[] = data?.data || [];
  const meta = data?.meta;
  const totalPage = meta?.totalPage || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setStatus("");
    setCurrentPage(1);
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
        Error loading payments. Please try again later.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto container space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-black">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <CardTitle className="text-sm font-medium mb-3 text-gray-600">
                  Total Revenue
                </CardTitle>
                <p className="text-3xl font-bold text-gray-900">
                  ${paymentAnalytics?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <DollarSign className="w-14 h-14 bg-[#086646] text-white rounded-md p-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <CardTitle className="text-sm font-medium mb-3 text-teal-600">
                  Completed Payments
                </CardTitle>
                <p className="text-3xl font-bold text-teal-600">
                  {paymentAnalytics?.completedPayment || 0}
                </p>
              </div>
              <div>
                <CheckCircle className="w-14 h-14 bg-[#DCFCE7] text-[#00A63E] rounded-md p-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <CardTitle className="text-sm font-medium mb-3 text-amber-600">
                  Pending Payments
                </CardTitle>
                <p className="text-3xl font-bold text-amber-600">
                  {paymentAnalytics?.pendingPayment || 0}
                </p>
              </div>
              <div>
                <Clock className="w-14 h-14 bg-[#f59e0b] text-white rounded-md p-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <CardTitle className="text-sm font-medium mb-3 text-red-600">
                  Failed Payments
                </CardTitle>
                <p className="text-3xl font-bold text-red-600">
                  {paymentAnalytics?.failedPayment || 0}
                </p>
              </div>
              <div>
                <XCircle className="w-14 h-14 bg-[#ef4444] text-white rounded-md p-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction History
            </h2>
            <div className="flex items-center gap-3">
              {status && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-red-500"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-gray-700"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {status || "All"}
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusChange("")}>
                    All Payments
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("success")}
                  >
                    Success
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("pending")}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("failed")}
                  >
                    Failed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                      Transaction ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                      Order ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                      Customer
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap text-center">
                      Payment Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap text-center">
                      Order Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center whitespace-nowrap">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paymentData.map((payment: Payment) => (
                    <TableRow
                      key={payment._id}
                      className="bg-white hover:bg-gray-50 transition"
                    >
                      {/* 1. Transaction ID */}
                      <TableCell className="whitespace-nowrap">{payment.customTransactionId}</TableCell>

                      {/* 2. Order ID */}
                      <TableCell className="whitespace-nowrap font-medium">#{payment.orderId.orderUniqueId}</TableCell>

                      {/* 3. Customer */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {payment.userId.firstName} {payment.userId.lastName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {payment.userId.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* 4. Amount */}
                      <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                        ${payment.amount}{" "}
                        <span className="text-[10px] uppercase text-gray-400">
                          {payment.currency}
                        </span>
                      </TableCell>

                      {/* 5. Payment Status */}
                      <TableCell className="text-center">
                        <Badge
                          className={`capitalize pointer-events-none whitespace-nowrap ${
                            payment.status === "success"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>

                      {/* 6. Order Status */}
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="capitalize pointer-events-none font-normal whitespace-nowrap"
                        >
                          {payment.orderId.orderStatus}
                        </Badge>
                      </TableCell>

                      {/* 7. Date */}
                      <TableCell className="text-gray-500 text-center text-sm whitespace-nowrap">
                        {new Date(payment.paymentDate).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paymentData.length === 0 && (
                    <TableRow>
                      <td colSpan={7} className="py-12 text-center text-gray-500 font-medium">
                        No payments found matching your criteria.
                      </td>
                    </TableRow>
                  )}
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
    </main>
  );
}
