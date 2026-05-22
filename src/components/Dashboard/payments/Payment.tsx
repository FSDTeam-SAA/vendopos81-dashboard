'use client';

import { useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  ChevronDown,
  Loader2,
  Filter,
  RotateCcw,
  DollarSign,
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { useAllPayments } from '@/lib/hooks/usePayment';
import { Payment, PaymentAnalytics } from '@/lib/types/payment';
import { cn } from '@/lib/utils';
import Pagination from '../../shared/Pagination';

export default function Payments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>('');
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
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatus('');
    setCurrentPage(1);
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${paymentAnalytics?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-700',
    },
    {
      title: 'Completed Payments',
      value: paymentAnalytics?.completedPayment || 0,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
    },
    {
      title: 'Pending Payments',
      value: paymentAnalytics?.pendingPayment || 0,
      icon: Clock3,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-700',
    },
    {
      title: 'Failed Payments',
      value: paymentAnalytics?.failedPayment || 0,
      icon: XCircle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-700',
    },
  ];

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-700';

      case 'pending':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';

      case 'failed':
        return 'border-red-200 bg-red-50 text-red-700';

      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'border-green-200 bg-green-50 text-green-700';

      case 'pending':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';

      case 'cancelled':
        return 'border-red-200 bg-red-50 text-red-700';

      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#086646]" />
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
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto p-6 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="border border-gray-200 bg-white rounded-2xl shadow-none"
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-500 mb-3">
                      {item.title}
                    </CardTitle>

                    <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                  </div>

                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center',
                      item.iconBg,
                    )}
                  >
                    <Icon className={cn('w-7 h-7', item.iconColor)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* TABLE SECTION */}
        <div className="space-y-5">
          {/* TOPBAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>

              <p className="text-sm text-gray-500 mt-1">
                View and track all payment records and statuses.
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
                    className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-none"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {status || 'All'}
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Filter by Payment Status</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleStatusChange('')}>
                    All Payments
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleStatusChange('success')}>
                    Success
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                    Pending
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleStatusChange('failed')}>
                    Failed
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
                      Transaction ID
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Order ID
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Customer
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Amount
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Payment Status
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Order Status
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paymentData.map((payment: Payment) => (
                    <TableRow
                      key={payment._id}
                      className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* TRANSACTION ID */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {payment.customTransactionId}
                        </span>
                      </TableCell>

                      {/* ORDER ID */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-800">
                          #{payment.orderId?.orderUniqueId}
                        </span>
                      </TableCell>

                      {/* CUSTOMER */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {payment.userId.firstName} {payment.userId.lastName}
                          </span>

                          <span className="text-xs text-gray-500 mt-1">{payment.userId.email}</span>
                        </div>
                      </TableCell>

                      {/* AMOUNT */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ${payment.amount}
                        </span>

                        <span className="ml-2 text-[10px] uppercase text-gray-400">
                          {payment.currency}
                        </span>
                      </TableCell>

                      {/* PAYMENT STATUS */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium capitalize border',
                            getPaymentStatusClass(payment.status),
                          )}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>

                      {/* ORDER STATUS */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium capitalize border',
                            getOrderStatusClass(payment.orderId?.orderStatus),
                          )}
                        >
                          {payment.orderId?.orderStatus}
                        </Badge>
                      </TableCell>

                      {/* DATE */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {new Date(payment.paymentDate).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}

                  {paymentData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-sm text-gray-500">
                        No payment records found.
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
}
