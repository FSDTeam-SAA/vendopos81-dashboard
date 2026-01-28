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
} from "lucide-react";
import {
  useAllSuppliers,
  useDeleteSingleSuppliers,
  useUpdateSupplierStatus,
} from "@/lib/hooks/useSuppliers";
import { Analytics, Supplier } from "@/lib/types/supplier";
import SuppliersModal from "./SuppliersModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SuppliersModels from "./SuppliersModal";

export default function SupplierManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [isSuspended, setIsSuspended] = useState<string>("all");
  const { mutate: deleteSupplier } = useDeleteSingleSuppliers();
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

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      deleteSupplier(id);
    }
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatus({ id, status });
  };

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
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
        {/* Header */}
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Supplier Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor your suppliers
          </p>
        </div> */}

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
                          Joined {new Date(supplier.createdAt).toLocaleDateString()}
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
                      <Badge
                        variant={
                          supplier.status === "approved"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          supplier.status === "approved"
                            ? "bg-green-100 text-green-700 hover:bg-green-100 capitalize"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 capitalize"
                        }
                      >
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          onClick={() => handleDelete(supplier._id)}
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
                                handleUpdateStatus(supplier._id, "approved")
                              }
                              className="cursor-pointer"
                            >
                              Approved
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(supplier._id, "rejected")
                              }
                              className="cursor-pointer"
                            >
                              Reject
                            </DropdownMenuItem>
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
          {meta && meta.totalPage > 1 && (
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
              {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((page) => (
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
              ))}
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900 bg-transparent"
                onClick={() => handlePageChange(Math.min(meta.totalPage, currentPage + 1))}
                disabled={currentPage === meta.totalPage}
              >
                →
              </Button>
            </div>
          )}
        </div>
      </div>
      <SuppliersModels
        viewModalOpen={modalOpen}
        setViewModalOpen={setModalOpen}
        id={selectedSupplier?._id || ""}
      />
    </main>
  );
}
 