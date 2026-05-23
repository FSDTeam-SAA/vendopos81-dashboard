'use client';

import ConfirmModal from '@/components/shared/ConfirmModal';
import Loading from '@/components/shared/Loading';
import Pagination from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  useAllSuppliers,
  useDeleteSingleSuppliers,
  useUpdateSupplierStatus,
} from '@/lib/hooks/useSuppliers';
import { useSuspendUser } from '@/lib/hooks/useUsers';
import { Analytics, Supplier } from '@/lib/types/supplier';
import {
  Eye,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Star,
  Trash2,
  Store,
  CheckCircle2,
  Clock3,
  Package,
} from 'lucide-react';
import { useState } from 'react';
import SuppliersModels from './SuppliersModal';

export default function SupplierManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSuspended, setIsSuspended] = useState<string>('all');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');

  const { mutate: deleteSupplier } = useDeleteSingleSuppliers();
  const { mutate: suspendUser } = useSuspendUser();
  const { mutate: updateStatus } = useUpdateSupplierStatus();

  const limit = 10;

  const { data, isLoading, isError } = useAllSuppliers({
    page: currentPage,
    limit: limit,
    isSuspended: isSuspended === 'all' ? undefined : isSuspended,
  });

  const SupplierManagementData: Analytics | undefined = data?.analytics;
  const suppliersData = data?.data || [];
  const meta = data?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Delete supplier
  const handleDelete = (supplier: Supplier) => {
    setConfirmTitle('Delete Supplier?');
    setConfirmDescription('This will permanently delete this supplier account.');

    setConfirmAction(() => () => {
      if (supplier._id) {
        deleteSupplier(supplier._id);
      }
      setConfirmOpen(false);
    });

    setConfirmOpen(true);
  };

  // Suspend supplier
  const handleSuspend = (userId: string) => {
    setConfirmTitle('Suspend Supplier?');
    setConfirmDescription('This supplier will not be able to access their account.');

    setConfirmAction(() => () => {
      suspendUser(userId);
      setConfirmOpen(false);
    });

    setConfirmOpen(true);
  };

  const handleUpdateStatus = (supplier: Supplier, status: string) => {
    updateStatus({
      id: supplier._id,
      status,
    });
  };

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  };

  if (isLoading) {
    return <Loading message="Loading suppliers..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading suppliers. Please try again later.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Supplier Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage supplier accounts, approvals, and platform activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-[#086646]"
              value={isSuspended}
              onChange={(e) => {
                setIsSuspended(e.target.value);
                handlePageChange(1);
              }}
            >
              <option value="all">All Suppliers</option>
              <option value="false">Active Only</option>
              <option value="true">Suspended Only</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border border-gray-200 shadow-none rounded-2xl bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Suppliers</p>
                  <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                    {SupplierManagementData?.totalSupplier || 0}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                  <Store className="h-5 w-5 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-none rounded-2xl bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Suppliers</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[#086646]">
                    {SupplierManagementData?.totalActive || 0}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-[#086646]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-none rounded-2xl bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                  <h2 className="mt-3 text-3xl font-semibold text-amber-600">
                    {SupplierManagementData?.totalPending || 0}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                  <Clock3 className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-none rounded-2xl bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                    {SupplierManagementData?.totalProducts || 0}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Supplier
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Location
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Rating
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </TableHead>

                  <TableHead className="text-center whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </TableHead>

                  <TableHead className="text-center whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {suppliersData.length > 0 ? (
                  suppliersData.map((supplier: Supplier) => (
                    <TableRow
                      key={supplier._id}
                      className="border-b border-gray-100 hover:bg-gray-50/60"
                    >
                      {/* Supplier */}
                      <TableCell className="py-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                            <Store className="h-5 w-5 text-gray-600" />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {supplier.shopName || supplier.brandName}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Joined {new Date(supplier.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="py-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{supplier.email}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{supplier.userId?.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{supplier.location || 'N/A'}</span>
                        </div>
                      </TableCell>

                      {/* Rating */}
                      <TableCell className="py-5">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                          <span className="font-medium text-gray-800">{supplier.rating}</span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-5">
                        {supplier.isSuspended ? (
                          <Badge className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
                            Suspended
                          </Badge>
                        ) : (
                          <Badge
                            className={`capitalize border ${
                              supplier.status === 'approved'
                                ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-50'
                                : supplier.status === 'pending'
                                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50'
                                  : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {supplier.status}
                          </Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            onClick={() => handleDelete(supplier)}
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-gray-100"
                              >
                                <MoreVertical className="h-4 w-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(supplier, 'approved')}
                                className="cursor-pointer"
                              >
                                Approve Supplier
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(supplier, 'rejected')}
                                className="cursor-pointer"
                              >
                                Reject Supplier
                              </DropdownMenuItem>

                              {supplier.userId?._id && !supplier.isSuspended && (
                                <DropdownMenuItem
                                  onClick={() => handleSuspend(supplier.userId!._id)}
                                  className="cursor-pointer text-red-600 focus:text-red-700"
                                >
                                  Suspend Supplier
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>

                      {/* View */}
                      <TableCell className="py-5 text-center">
                        <Button
                          onClick={() => handleView(supplier)}
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-lg border-gray-200 px-4 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Store className="mb-3 h-10 w-10 text-gray-300" />
                        <p className="text-sm font-medium text-gray-600">No suppliers found</p>
                      </div>
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

        {/* Confirm Modal */}
        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmAction}
          title={confirmTitle}
          description={confirmDescription}
          confirmText="Yes, Continue"
          variant="destructive"
        />
      </div>

      {/* View Modal */}
      <SuppliersModels
        viewModalOpen={modalOpen}
        setViewModalOpen={setModalOpen}
        id={selectedSupplier?._id || ''}
      />
    </main>
  );
}
