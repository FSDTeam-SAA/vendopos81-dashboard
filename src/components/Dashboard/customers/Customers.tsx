"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Eye, Mail, ShoppingCart } from "lucide-react";
import { useState } from "react";

import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";
import { useAllUsers } from "@/lib/hooks/useUsers";
import { Analytics, User } from "@/lib/types/users";
import CustomerModal from "./CustomerModal";

export default function Customers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<User | null>(null);
  const [isSuspended, setIsSuspended] = useState<string>("all");
  const limit = 10;

  const { data, isLoading, isError } = useAllUsers({
    page: currentPage,
    limit: limit,
    isSuspended: isSuspended === "all" ? undefined : isSuspended,
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
        Error loading Customers. Please try again later.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto container space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
          <Card className="bg-white gap-2 border-0">
            <CardHeader className="">
              <CardTitle className="text-md font-medium text-[#6C757D]">
                Total Customers{" "}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl  text-gray-900">
                {usersAnalytics?.totalCustomer || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white gap-2 border-0 ">
            <CardHeader className="">
              <CardTitle className="text-md font-medium text-[#6C757D]">
                Active Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h5 className="text-3xl  text-[#086646]">
                {usersAnalytics?.totalActive || 0}
              </h5>
            </CardContent>
          </Card>

          <Card className="bg-white gap-2 border-0">
            <CardHeader className="">
              <CardTitle className="text-md font-medium text-[#6C757D]">
                New This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl ">{usersAnalytics?.totalSuspended || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer List
            </h2>
            <div className="flex items-center gap-2">
              <select
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 outline-none"
                value={isSuspended}
                onChange={(e) => {
                  setIsSuspended(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Status</option>
                <option value="false">Active Only</option>
                <option value="true">Suspended Only</option>
              </select>
            </div>
          </div>

          <Card className="bg-white border-0 pt-0 px-2 overflow-hidden text-black">
            <Table className="py-2">
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Orders
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Total Spent
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Last Order
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {usersData.length > 0 ? (
                  usersData.map((user: User) => (
                    <TableRow
                      key={user._id}
                      className="bg-white hover:bg-gray-50/50 transition-colors border-b border-gray-100"
                    >
                      {/* 1. Customer */}
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Member since{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-500">{user.email}</span>
                        </div>
                      </TableCell>

                      {/* 3. Order ID */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ShoppingCart className="w-4 h-4 text-gray-500" />
                          <span>{user.totalOrder}</span>
                        </div>
                      </TableCell>

                      {/* 4. Amount */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-green-700">
                            ${user.totalSpent?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </TableCell>

                      {/* 5. Payment Status */}
                      <TableCell>
                        <Badge
                          className={`capitalize ${
                            user.isSuspended
                              ? "bg-red-100 text-red-900 hover:bg-red-100"
                              : "bg-green-100 text-green-900 hover:bg-green-100"
                          }`}
                        >
                          {user.isSuspended ? "Suspended" : "Active"}
                        </Badge>
                      </TableCell>

                      {/* 6. Date */}
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>

                      {/* 7. Actions */}
                      <TableCell className="text-center b">
                        <Button
                          onClick={() => handleView(user)}
                          variant="ghost"
                          size="icon"
                          className=" w-full  border  text-secondary-foreground hover:text-secondary-foreground/90 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" /> view
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-gray-500"
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <div className="flex items-center justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={meta?.totalPage || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <CustomerModal
          modalOpen={modalOpen}
          onModalChange={setModalOpen}
          data={selectedOrder}
        />
      </div>
    </main>
  );
}
