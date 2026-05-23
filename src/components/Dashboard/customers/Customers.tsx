'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, Eye, Mail, ShoppingCart, Users, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';

import Loading from '@/components/shared/Loading';
import Pagination from '@/components/shared/Pagination';
import { useAllUsers } from '@/lib/hooks/useUsers';
import { Analytics, User } from '@/lib/types/users';
import CustomerModal from './CustomerModal';

export default function Customers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<User | null>(null);
  const [isSuspended, setIsSuspended] = useState<string>('all');

  const limit = 10;

  const { data, isLoading, isError } = useAllUsers({
    page: currentPage,
    limit: limit,
    isSuspended: isSuspended === 'all' ? undefined : isSuspended,
  });

  const usersAnalytics: Analytics | undefined = data?.analytics;
  const usersData = data?.data || [];
  const meta = data?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (user: User) => {
    setSelectedOrder(user);
    setModalOpen(true);
  };

  if (isLoading) {
    return <Loading message="Loading Customers..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading customers. Please try again later.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor customer activity and account status.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <select
              className="h-10 min-w-[180px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#086646]"
              value={isSuspended}
              onChange={(e) => {
                setIsSuspended(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Customers</option>
              <option value="false">Active Customers</option>
              <option value="true">Suspended Customers</option>
            </select>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* Total Customers */}
          <Card className="border border-gray-200 bg-white shadow-none rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <h2 className="mt-2 text-3xl font-semibold text-gray-900">
                  {usersAnalytics?.totalCustomer || 0}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <Users className="h-5 w-5 text-gray-700" />
              </div>
            </CardContent>
          </Card>

          {/* Active Customers */}
          <Card className="border border-gray-200 bg-white shadow-none rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Customers</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#086646]">
                  {usersAnalytics?.totalActive || 0}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <UserCheck className="h-5 w-5 text-[#086646]" />
              </div>
            </CardContent>
          </Card>

          {/* Suspended Customers */}
          <Card className="border border-gray-200 bg-white shadow-none rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Suspended Customers</p>
                <h2 className="mt-2 text-3xl font-semibold text-red-600">
                  {usersAnalytics?.totalSuspended || 0}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-gray-200">
                  <TableHead className="h-12 whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </TableHead>

                  {/* <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </TableHead> */}

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Orders
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total Spent
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined Date
                  </TableHead>

                  <TableHead className="text-center whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {usersData.length > 0 ? (
                  usersData.map((user: User) => (
                    <TableRow
                      key={user._id}
                      className="border-b border-gray-100 hover:bg-gray-50/70"
                    >
                      {/* Customer */}
                      <TableCell className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-md font-semibold text-gray-700">
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Orders */}
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ShoppingCart className="h-4 w-4 text-gray-400" />
                          <span>{user.totalOrder}</span>
                        </div>
                      </TableCell>

                      {/* Total Spent */}
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />

                          <span className="font-semibold text-[#086646]">
                            ${user.totalSpent?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-5">
                        <Badge
                          className={`border font-medium capitalize shadow-none ${
                            user.isSuspended
                              ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-50'
                              : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-50'
                          }`}
                        >
                          {user.isSuspended ? 'Suspended' : 'Active'}
                        </Badge>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="py-5 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-5 text-center">
                        <Button
                          onClick={() => handleView(user)}
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-lg border-gray-200 bg-white px-4 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center text-sm text-gray-500">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={meta?.totalPage || 1}
          onPageChange={handlePageChange}
        />

        {/* Modal */}
        <CustomerModal modalOpen={modalOpen} onModalChange={setModalOpen} data={selectedOrder} />
      </div>
    </main>
  );
}
