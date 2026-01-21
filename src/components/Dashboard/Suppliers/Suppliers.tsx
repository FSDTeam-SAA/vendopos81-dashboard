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
} from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  joinDate: string;
  contact: string;
  phone: string;
  location: string;
  products: number;
  rating: number;
  status: "Active" | "Suspend";
}

const SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "TechGear Suppliers",
    joinDate: "2023-01-15",
    contact: "contact@techgear.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    products: 45,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    name: "Fashion Hub Co.",
    joinDate: "2023-03-22",
    contact: "info@fashionhub.com",
    phone: "+1 234 567 8901",
    location: "Los Angeles, USA",
    products: 128,
    rating: 4.6,
    status: "Active",
  },
  {
    id: 3,
    name: "Organic Foods Ltd",
    joinDate: "2023-06-10",
    contact: "sales@organicfoods.com",
    phone: "+1 234 567 8902",
    location: "Chicago, USA",
    products: 67,
    rating: 4.9,
    status: "Suspend",
  },
  {
    id: 4,
    name: "BookWorld Distributors",
    joinDate: "2022-11-05",
    contact: "support@bookworld.com",
    phone: "+1 234 567 8903",
    location: "Boston, USA",
    products: 234,
    rating: 4.7,
    status: "Active",
  },
];

export default function SupplierManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalSuppliers = 89;
  const activeSuppliers = 67;
  const pendingApproval = 12;
  const totalProducts = 1247;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto container space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Supplier Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor your suppliers
          </p>
        </div>

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
                {totalSuppliers}
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
                {activeSuppliers}
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
                {pendingApproval}
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
                {totalProducts}
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
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 border cursor-pointer"
            >
              Sort by <ChevronDown />
            </Button>
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
                  <TableHead className="font-semibold text-gray-700">
                    Actions
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SUPPLIERS.map((supplier) => (
                  <TableRow
                    key={supplier.id}
                    className="hover:bg-gray-50/50 transition-colors border-b border-gray-100"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {supplier.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Joined {supplier.joinDate}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />{" "}
                          {supplier.contact}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />{" "}
                          {supplier.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />{" "}
                        {supplier.location}
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
                          supplier.status === "Active"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          supplier.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }
                      >
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
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
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900 bg-transparent"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 bg-transparent"
            >
              1
            </Button>
            <Button
              size="sm"
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 bg-transparent"
            >
              3
            </Button>
            <span className="text-gray-500">...</span>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 bg-transparent"
            >
              6
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900 bg-transparent"
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
