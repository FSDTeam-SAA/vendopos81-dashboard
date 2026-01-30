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
  ChevronDown,
  Loader2,
  Filter,
  RotateCcw,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useAllSettlements } from "@/lib/hooks/usePaymentsttatment";
import { Settlement, Analytics } from "@/lib/types/paymentTransfer";

const PaymenTransfer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>("");

  const { data: settlementResponse, isLoading, isError } = useAllSettlements();

  // Normalize the API response to ensure `settlements` is always an array.
  // Some endpoints return `{ data: [...] }`, others return `[...]` or `{ docs: [...] }`.
  const settlementsRaw = settlementResponse?.data ?? settlementResponse;
  const settlements: Settlement[] = Array.isArray(settlementsRaw)
    ? settlementsRaw
    : Array.isArray(settlementsRaw?.data)
      ? settlementsRaw.data
      : Array.isArray(settlementsRaw?.docs)
        ? settlementsRaw.docs
        : [];

  const analytics: Analytics | undefined = settlementResponse?.analytics;
  const meta = settlementResponse?.meta;
  const totalPage = meta?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
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
        Error loading payment transfers. Please try again later.
      </div>
    );
  }

  // Filter settlements on client side since the current hook doesn't support params
  const filteredSettlements = status
    ? settlements.filter(
        (s: Settlement) => s.status.toLowerCase() === status.toLowerCase(),
      )
    : settlements;

  const handleTransaction = (settlement: Settlement) => {
    // Implement the logic to handle transaction details view
    console.log("Transaction details for settlement:", settlement);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto container space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <CardTitle className="text-sm font-medium mb-3 text-gray-600">
                  Total Transferred
                </CardTitle>
                <p className="text-3xl font-bold text-gray-900">
                  ${analytics?.totalTransferred?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <CheckCircle className="w-14 h-14 bg-[#086646] text-white rounded-md p-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <CardTitle className="text-sm font-medium mb-3 text-amber-600">
                  Total Pending
                </CardTitle>
                <p className="text-3xl font-bold text-amber-600">
                  ${analytics?.totalPending?.toLocaleString() || 0}
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
                <CardTitle className="text-sm font-medium mb-3 text-blue-600">
                  Total Requested
                </CardTitle>
                <p className="text-3xl font-bold text-blue-600">
                  ${analytics?.totalRequested?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <Send className="w-14 h-14 bg-blue-100 text-blue-600 rounded-md p-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Transfer History
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
                    All Transfers
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("transferred")}
                  >
                    Transferred
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("pending")}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("requested")}
                  >
                    Requested
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
                      Supplier
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                      Brand Name
                    </TableHead>

                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                      Admin Fee
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                      Payable Amount
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap text-center">
                      Transfer Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 whitespace-nowrap text-center">
                      Order Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center whitespace-nowrap">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredSettlements?.map((settlement: Settlement) => (
                    <TableRow
                      key={settlement._id}
                      className="bg-white hover:bg-gray-50 transition"
                    >
                      {/* 1. Supplier */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {settlement.supplierId?.shopName ||
                              settlement.supplierId?.brandName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {settlement.supplierId?.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* 2. ShopName/Brand Name */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {settlement.supplierId?.brandName}
                          </span>
                        </div>
                      </TableCell>

                      {/* 4. Amount */}
                      <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>${settlement.adminCommission}</span>
                          {/* <span className="text-[10px] text-gray-400">
                            Total: ${settlement.adminCommission}
                          </span> */}
                        </div>
                      </TableCell>
                      {/* 4. Amount */}
                      <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>${settlement.payableAmount}</span>
                          {/* <span className="text-[10px] text-gray-400">
                            Total: ${settlement.adminCommission}
                          </span> */}
                        </div>
                      </TableCell>

                      {/* 5. Transfer Status */}
                      <TableCell className="text-center">
                        <Badge
                          className={`capitalize pointer-events-none whitespace-nowrap ${
                            settlement.status === "transferred"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : settlement.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {settlement.status}
                        </Badge>
                      </TableCell>

                      {/* 6. Order Status */}
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="capitalize pointer-events-none font-normal whitespace-nowrap"
                        >
                          {settlement.orderId?.paymentStatus}
                        </Badge>
                      </TableCell>

                      {/* 7. Action */}
                      {settlement.orderId.paymentStatus === "paid" ? (
                        <TableCell className="text-center whitespace-nowrap">
                          <span className="text-gray-500">N/A</span>
                        </TableCell>
                      ) : (
                        <TableCell className="text-center whitespace-nowrap">
                          <Button
                            onClick={() => handleTransaction(settlement)}
                            size="sm"
                            // variant="outline"
                            className="h-8 bg-[#086646] text-white hover:bg-[#06543f]    "
                          >
                            {/* <DollarSign className="w-4 h-4 mr-2" /> */}
                            Transaction Now
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {filteredSettlements.length === 0 && (
                    <TableRow>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-500 font-medium"
                      >
                        No transfers found.
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
};

export default PaymenTransfer;
