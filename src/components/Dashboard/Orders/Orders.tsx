'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  ShoppingBag,
  CheckCircle2,
  Clock3,
  DollarSign,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import OrdersModal from './OrdersModal';
import { useAllOrders } from '@/lib/hooks/useOrder';
import { Order, OrderAnalytics } from '@/lib/types/order';
import Pagination from '../../shared/Pagination';
import { cn } from '@/lib/utils';

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('');
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
  const handleFilterChange = (type: 'orderStatus' | 'paymentType', value: string) => {
    if (type === 'orderStatus') setOrderStatus(value);
    if (type === 'paymentType') setPaymentType(value);

    setCurrentPage(1);
  };

  const clearFilters = () => {
    setOrderStatus('');
    setPaymentType('');
    setCurrentPage(1);
  };

  // Manual Pagination Logic
  const totalItems = orderData.length;
  const totalPage = Math.ceil(totalItems / limit);

  const paginatedData = orderData.slice((currentPage - 1) * limit, currentPage * limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';

      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-100';

      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-100';

      default:
        return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';

      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-100';

      default:
        return 'bg-red-50 text-red-700 border border-red-100';
    }
  };

  const stats = [
    {
      title: 'Total Orders',
      value: orderAnalytics?.totalOrder || 0,
      icon: ShoppingBag,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
    },
    {
      title: 'Delivered Orders',
      value: orderAnalytics?.totalDeliveredOrder || 0,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
    },
    {
      title: 'Pending Orders',
      value: orderAnalytics?.totalPendingOrder || 0,
      icon: Clock3,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-700',
    },
    {
      title: 'Total Sales',
      value: `$${orderAnalytics?.totalSalesAmount?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-700',
    },
  ];

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
        Error loading orders. Please try again later.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="border border-gray-200 bg-white rounded-2xl shadow-none"
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{item.title}</p>

                    <h3 className="mt-3 text-3xl font-bold text-gray-900">{item.value}</h3>
                  </div>

                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center',
                      item.iconBg,
                    )}
                  >
                    <Icon className={cn('w-6 h-6', item.iconColor)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* TABLE SECTION */}
        <div className="space-y-5">
          {/* TOPBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage and monitor all incoming customer orders.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* ORDER STATUS FILTER */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-none"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {orderStatus || 'All'}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Filter by Order Status</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleFilterChange('orderStatus', '')}>
                    All Statuses
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleFilterChange('orderStatus', 'pending')}>
                    Pending
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleFilterChange('orderStatus', 'delivered')}>
                    Delivered
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleFilterChange('orderStatus', 'cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* PAYMENT FILTER */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-none"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Payment: {paymentType || 'All'}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Filter by Payment Type</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleFilterChange('paymentType', '')}>
                    All Payments
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleFilterChange('paymentType', 'cod')}>
                    COD
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleFilterChange('paymentType', 'online')}>
                    Online
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* CLEAR FILTER */}
              {(orderStatus || paymentType) && (
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
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Order ID
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Customer
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Products
                    </TableHead>

                    <TableHead className="h-14 px-6 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Amount
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Order Status
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Payment Status
                    </TableHead>

                    <TableHead className="h-14 px-6 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Order Date
                    </TableHead>

                    <TableHead className="h-14 px-6 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((order: Order) => (
                    <TableRow
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* ORDER ID */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">#{order.orderUniqueId}</span>
                      </TableCell>

                      {/* CUSTOMER */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {order.userId.firstName} {order.userId.lastName}
                          </span>

                          <span className="text-xs text-gray-500 mt-1">{order.userId.email}</span>
                        </div>
                      </TableCell>

                      {/* PRODUCTS */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-700">
                          {order.items.length} items
                        </span>
                      </TableCell>

                      {/* AMOUNT */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </TableCell>

                      {/* ORDER STATUS */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          className={cn(
                            'capitalize rounded-full px-3 py-1 text-xs font-medium shadow-none',
                            getOrderStatusClass(order.orderStatus),
                          )}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>

                      {/* PAYMENT STATUS */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          className={cn(
                            'capitalize rounded-full px-3 py-1 text-xs font-medium shadow-none',
                            getPaymentStatusClass(order.paymentStatus),
                          )}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>

                      {/* ORDER DATE */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {new Date(order.purchaseDate).toLocaleDateString()}
                        </span>
                      </TableCell>

                      {/* ACTION */}
                      <TableCell className="px-6 py-5 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-none"
                          onClick={() => viewOrder(order)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-sm text-gray-500">
                        No orders found.
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

      <OrdersModal modalOpen={modalOpen} onModalChange={setModalOpen} data={selectedOrder} />
    </main>
  );
}
