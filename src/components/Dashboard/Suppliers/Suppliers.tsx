"use client";

import ConfirmModal from "@/components/shared/ConfirmModal";
import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAllSuppliers,
  useDeleteSingleSuppliers,
  useUpdateSupplierStatus,
} from "@/lib/hooks/useSuppliers";
import { useSuspendUser } from "@/lib/hooks/useUsers";
import { Analytics, Supplier } from "@/lib/types/supplier";
import {
  Eye,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import SuppliersModels from "./SuppliersModal";

export default function SupplierManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [isSuspended, setIsSuspended] = useState<string>("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  const { mutate: deleteSupplier } = useDeleteSingleSuppliers();
  // const { mutate: deleteUser } = useDeleteUser();
  const { mutate: suspendUser } = useSuspendUser();
  const { mutate: updateStatus } = useUpdateSupplierStatus();
  const limit = 10;

  const { data, isLoading, isError } = useAllSuppliers({
    page: currentPage,
    limit: limit,
    isSuspended: isSuspended === "all" ? undefined : isSuspended,
  });

  const SupplierManagementData: Analytics | undefined = data?.analytics;
  const suppliersData = data?.data || [];
  const meta = data?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Delete a supplier ==================================
  const handleDelete = (supplier: Supplier) => {
    // console.log("this is deleted supplier data", supplier._id);
    setConfirmTitle("Delete Supplier?");
    setConfirmDescription(
      "This will permanently delete this supplier account.",
    );

    setConfirmAction(() => () => {
      if (supplier._id) {
        deleteSupplier(supplier._id);
      }
      setConfirmOpen(false);
    });

    setConfirmOpen(true);
  };

  // Suspend a supplier ==================================
  const handleSuspend = (userId: string) => {
    setConfirmTitle("Suspend Supplier?");
    setConfirmDescription(
      "This supplier will not be able to access their account.",
    );

    setConfirmAction(() => () => {
      suspendUser(userId);
      setConfirmOpen(false);
    });

    setConfirmOpen(true);
  };

  const handleUpdateStatus = (supplier: Supplier, status: string) => {
    // console.log({ id: supplier._id, status });

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
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto container space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {SupplierManagementData?.totalSupplier || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-teal-600">
                Active Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-teal-600">
                {SupplierManagementData?.totalActive || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-600">
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">
                {SupplierManagementData?.totalPending || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {SupplierManagementData?.totalProducts || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              All Suppliers
            </h2>
            <div className="flex items-center gap-2">
              <select
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 outline-none"
                value={isSuspended}
                onChange={(e) => {
                  setIsSuspended(e.target.value);
                  handlePageChange(1);
                }}
              >
                <option value="all">All Status</option>
                <option value="false">Active Only</option>
                <option value="true">Suspended Only</option>
              </select>
            </div>
          </div>

          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-700">
                    Supplier
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Location
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Rating
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    Actions
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliersData.map((supplier: Supplier) => (
                  <TableRow
                    key={supplier._id}
                    className="hover:bg-gray-50/50 transition-colors border-b border-gray-100"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {supplier.shopName || supplier.brandName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Joined{" "}
                          {new Date(supplier.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />{" "}
                          {supplier.email}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />{" "}
                          {supplier.userId?.phone || "N/A"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />{" "}
                        {supplier.location || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-900 font-medium">
                          {supplier.rating}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.isSuspended ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 capitalize">
                          Suspended
                        </Badge>
                      ) : (
                        <Badge
                          className={
                            supplier.status === "approved"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 capitalize"
                              : supplier.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 capitalize"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100 capitalize"
                          }
                        >
                          {supplier.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          onClick={() => handleDelete(supplier)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(supplier, "approved")
                              }
                              className="cursor-pointer"
                            >
                              Approved
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(supplier, "rejected")
                              }
                              className="cursor-pointer"
                            >
                              Rejected
                            </DropdownMenuItem>
                            {supplier.userId?._id && !supplier.isSuspended && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleSuspend(supplier.userId!._id)
                                }
                                className="cursor-pointer text-red-600 focus:text-red-700"
                              >
                                Suspend
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleView(supplier)}
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
          <div className="flex items-center justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={meta?.totalPage || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
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
      <SuppliersModels
        viewModalOpen={modalOpen}
        setViewModalOpen={setModalOpen}
        id={selectedSupplier?._id || ""}
      />
    </main>
  );
}
