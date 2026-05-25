/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BadgeDollarSign,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  Loader2,
  RotateCcw,
  Send,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

import { useAllSettlements, useTransferPaymentToSupplier } from '@/lib/hooks/usePaymentsttatment';
import { Analytics, Settlement } from '@/lib/types/paymentTransfer';
import { cn } from '../../../lib/utils';
import Pagination from '../../shared/Pagination';
import { toast } from 'sonner';

const PaymenTransfer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: settlementResponse, isLoading, isError, refetch } = useAllSettlements();

  const { mutate: transferPayment } = useTransferPaymentToSupplier();

  const settlementsRaw = settlementResponse?.data ?? settlementResponse;

  const settlements: Settlement[] = Array.isArray(settlementsRaw)
    ? settlementsRaw
    : Array.isArray(settlementsRaw?.data)
      ? settlementsRaw.data
      : Array.isArray(settlementsRaw?.docs)
        ? settlementsRaw.docs
        : [];

  const analytics: Analytics | undefined =
    settlementResponse?.data?.analytics ?? settlementResponse?.analytics;
  const meta = settlementResponse?.data?.meta ?? settlementResponse?.meta;
  const totalPage = meta?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatus('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        <Loader2 className="w-10 h-10 animate-spin text-[#086646]" />
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

  const filteredSettlements = status
    ? settlements.filter((s: Settlement) => s.status.toLowerCase() === status.toLowerCase())
    : settlements;

  const handleTransaction = (settlement: Settlement) => {
    setProcessingId(settlement._id);

    transferPayment(settlement._id, {
      onSuccess: (response) => {
        toast.success(response?.message || 'Payment transferred successfully');

        setProcessingId(null);

        refetch();
      },

      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to transfer payment');

        setProcessingId(null);
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border border-gray-200 bg-white rounded-xl shadow-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-medium text-gray-500 mb-2">
                  Total Transferred
                </CardTitle>

                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalTransferred?.toLocaleString() || 0}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#086646]/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#086646]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white rounded-xl shadow-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-medium text-amber-600 mb-2">
                  Total Pending
                </CardTitle>

                <p className="text-2xl font-bold text-amber-600">
                  {analytics?.totalPending?.toLocaleString() || 0}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white rounded-xl shadow-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-medium text-blue-600 mb-2">
                  Total Requested
                </CardTitle>

                <p className="text-2xl font-bold text-blue-600">
                  {analytics?.totalRequested?.toLocaleString() || 0}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white rounded-xl shadow-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-medium text-purple-600 mb-2">
                  Transfer Amount
                </CardTitle>

                <p className="text-2xl font-bold text-purple-600">
                  ${analytics?.totalTransferredAmount?.toLocaleString() || 0}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white rounded-xl shadow-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-medium text-[#086646] mb-2">
                  Admin Commission
                </CardTitle>

                <p className="text-2xl font-bold text-[#086646]">
                  ${analytics?.totalAdminCommission?.toLocaleString() || 0}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <BadgeDollarSign className="w-5 h-5 text-[#086646]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLE SECTION */}
        <div className="space-y-5">
          {/* TOPBAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transfer History</h2>

              <p className="text-sm text-gray-500 mt-1">
                View all supplier transfer records and statuses.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {status && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="
        h-10
        px-4
        bg-white
        border-gray-200
        text-gray-700
        rounded-sm
        hover:bg-gray-50
        hover:border-gray-300
        transition-all
        duration-200
      "
                  >
                    <Filter className="w-4 h-4 mr-2 text-gray-500" />

                    <span className="font-medium">Status: {status || 'All'}</span>

                    <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="
      w-52
      rounded-xl
      border border-gray-200
      bg-white
      shadow-lg
      p-2
    "
                >
                  <DropdownMenuLabel className="text-xs font-semibold text-gray-500 px-2 pb-2">
                    Filter by Status
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-gray-100" />

                  <DropdownMenuItem
                    onClick={() => handleStatusChange('')}
                    className="
        rounded-lg
        px-3
        py-2.5
        text-sm
        text-gray-700
        cursor-pointer
        focus:bg-gray-50
        hover:bg-gray-50
        transition-colors
      "
                  >
                    All Transfers
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleStatusChange('completed')}
                    className="
        rounded-lg
        px-3
        py-2.5
        text-sm
        text-gray-700
        cursor-pointer
        focus:bg-gray-50
        hover:bg-gray-50
        transition-colors
      "
                  >
                    Completed
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleStatusChange('pending')}
                    className="
        rounded-lg
        px-3
        py-2.5
        text-sm
        text-gray-700
        cursor-pointer
        focus:bg-gray-50
        hover:bg-gray-50
        transition-colors
      "
                  >
                    Pending
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleStatusChange('requested')}
                    className="
        rounded-lg
        px-3
        py-2.5
        text-sm
        text-gray-700
        cursor-pointer
        focus:bg-gray-50
        hover:bg-gray-50
        transition-colors
      "
                  >
                    Requested
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Supplier
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Total Amount
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Admin Fee
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Payable Amount
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Transfer Status
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Payment Status
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Order Status
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredSettlements?.map((settlement: Settlement) => (
                    <TableRow
                      key={settlement._id}
                      className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* SUPPLIER */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {settlement.supplierId?.shopName || settlement.supplierId?.brandName}
                          </span>

                          <span className="text-xs text-gray-500 mt-1">
                            {settlement.supplierId?.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* TOTAL AMOUNT */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ${settlement.totalAmount}
                        </span>
                      </TableCell>

                      {/* ADMIN FEE */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-700">
                          ${settlement.adminCommission}
                        </span>
                      </TableCell>

                      {/* PAYABLE AMOUNT */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-[#086646]">
                          ${settlement.payableAmount}
                        </span>
                      </TableCell>

                      {/* TRANSFER STATUS */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium capitalize border',

                            settlement.status === 'completed' &&
                              'border-green-200 bg-green-50 text-green-700',

                            settlement.status === 'pending' &&
                              'border-yellow-200 bg-yellow-50 text-yellow-700',

                            settlement.status === 'requested' &&
                              'border-blue-200 bg-blue-50 text-blue-700',
                          )}
                        >
                          {settlement.status}
                        </Badge>
                      </TableCell>

                      {/* PAYMENT STATUS */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize rounded-full px-3 py-1 text-xs font-medium border',

                            settlement.orderId?.paymentStatus === 'paid' &&
                              'border-green-200 bg-green-50 text-green-700',

                            settlement.orderId?.paymentStatus === 'pending' &&
                              'border-yellow-200 bg-yellow-50 text-yellow-700',

                            settlement.orderId?.paymentStatus === 'failed' &&
                              'border-red-200 bg-red-50 text-red-700',

                            settlement.orderId?.paymentStatus === 'refunded' &&
                              'border-blue-200 bg-blue-50 text-blue-700',

                            !['paid', 'pending', 'failed', 'refunded'].includes(
                              settlement.orderId?.paymentStatus || '',
                            ) && 'border-gray-200 bg-gray-50 text-gray-700',
                          )}
                        >
                          {settlement.orderId?.paymentStatus}
                        </Badge>
                      </TableCell>

                      {/* ORDER STATUS */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize rounded-full px-3 py-1 text-xs font-medium border',

                            settlement.orderId?.orderStatus === 'delivered' &&
                              'border-green-200 bg-green-50 text-green-700',

                            settlement.orderId?.orderStatus === 'pending' &&
                              'border-yellow-200 bg-yellow-50 text-yellow-700',

                            settlement.orderId?.orderStatus === 'cancelled' &&
                              'border-red-200 bg-red-50 text-red-700',

                            settlement.orderId?.orderStatus !== 'delivered' &&
                              settlement.orderId?.orderStatus !== 'pending' &&
                              settlement.orderId?.orderStatus !== 'cancelled' &&
                              'border-gray-200 bg-gray-50 text-gray-700',
                          )}
                        >
                          {settlement.orderId?.orderStatus}
                        </Badge>
                      </TableCell>

                      {/* ACTION */}
                      {settlement.status === 'requested' ? (
                        <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                          <Button
                            onClick={() => handleTransaction(settlement)}
                            disabled={processingId === settlement._id}
                            size="sm"
                            className="h-9 rounded-lg bg-[#086646] px-4 text-white hover:bg-[#06543f] shadow-none"
                          >
                            {processingId === settlement._id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              'Transfer Now'
                            )}
                          </Button>
                        </TableCell>
                      ) : settlement.status === 'pending' ? (
                        <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                            Not Requested
                          </span>
                        </TableCell>
                      ) : settlement.status === 'completed' ? (
                        <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                            Transferred Completed
                          </span>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}

                  {filteredSettlements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-sm text-gray-500">
                        No transfers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
};

export default PaymenTransfer;
