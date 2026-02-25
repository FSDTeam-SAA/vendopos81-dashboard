"use client";

import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReportTopSuppliersSingle } from "@/lib/hooks/useReport";
import { useSuspendUser } from "@/lib/hooks/useUsers";
import { Supplier } from "@/lib/types/singleSupplier";
import {
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  Building2,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldX,
  Store,
  Warehouse,
} from "lucide-react";

interface ViewModalProps {
  viewModalOpen: boolean;
  setViewModalOpen: (open: boolean) => void;
  id: string;
}

const SuppliersModels = ({
  viewModalOpen,
  setViewModalOpen,
  id,
}: ViewModalProps) => {
  const { data, isLoading } = useReportTopSuppliersSingle(id);
  const supplier: Supplier | undefined = data?.data;

  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();

  const handleSuspend = () => {
    if (!supplier?.userId?._id) return;
    suspendUser(supplier.userId._id, {
      onSuccess: () => setViewModalOpen(false),
    });
  };

  if (!id) return null;

  return (
    <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="w-5 h-5 text-teal-600" />
            Supplier Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loading message="Loading supplier details, please wait..." />
        ) : supplier ? (
          <div className="space-y-8 py-4">
            {/* ================= HEADER ================= */}
            <div className="bg-gradient-to-r from-green-100 to-white border rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden border">
                  {supplier.logo?.url ? (
                    <img
                      src={supplier.logo.url}
                      alt={supplier.shopName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {supplier.shopName}
                    </h3>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                        supplier.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : supplier.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </div>

                  <p className="text-gray-600 font-medium mt-1">
                    {supplier.brandName}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                    <span className="font-semibold text-yellow-600">
                      ⭐ {supplier.rating}
                    </span>
                    <span>• {supplier.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= METRICS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border rounded-xl p-4">
                <p className="text-xs uppercase text-gray-500 font-medium">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {supplier.totalOrders}
                </p>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-xs uppercase text-gray-500 font-medium">
                  Total Sales
                </p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  ৳ {supplier.totalSales?.toLocaleString()}
                </p>
              </div>

              <div
                className={`rounded-xl p-4 border transition-all ${
                  supplier.isSuspended
                    ? "bg-red-50 border-red-200"
                    : "bg-green-100  border-green-200"
                }`}
              >
                <p className="text-xs uppercase font-medium text-gray-500">
                  Account Status
                </p>

                <div className="flex items-center gap-2 mt-2">
                  {supplier.isSuspended ? (
                    <ShieldX className="w-5 h-5 text-red-600" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  )}

                  <span
                    className={`text-sm font-semibold ${
                      supplier.isSuspended ? "text-red-700" : "text-green-700"
                    }`}
                  >
                    {supplier.isSuspended ? "Suspended" : "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= CONTACT INFO ================= */}
            <div className="bg-white border rounded-2xl p-6 space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Contact Information
              </h4>

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-100">
                    <Mail className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Email</p>
                    <p className="font-semibold text-gray-800 break-all">
                      {supplier.userId?.email || supplier.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Phone</p>
                    <p className="font-semibold text-gray-800">
                      {supplier.userId?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Warehouse */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100">
                    <Warehouse className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Warehouse</p>
                    <p className="font-semibold text-gray-800">
                      {supplier.warehouseLocation || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Postal Code */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Postal Code
                    </p>
                    <p className="font-semibold text-gray-800">
                      {supplier.postalCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= ADDRESS ================= */}
            <div className="bg-white border flex gap-2 rounded-xl p-5 space-y-1">
              <h4 className="text-sm font-semibold uppercase text-gray-700">
                Location :
              </h4>

              <p className="text-sm text-gray-600">
                {supplier.street || supplier.address}, {supplier.location}
              </p>
            </div>

            {/* ================= DESCRIPTION ================= */}
            {supplier.description && (
              <div className="bg-gray-50 border rounded-xl p-5 space-y-2">
                <h4 className="text-sm font-semibold uppercase text-gray-700">
                  About Supplier
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {supplier.description}
                </p>
              </div>
            )}

            {/* ================= DOCUMENTS ================= */}
            {supplier.documentUrl && supplier.documentUrl.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-gray-700">
                  <FileText className="w-4 h-4" />
                  Documents
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {supplier.documentUrl.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group rounded-xl overflow-hidden border hover:border-teal-500 transition"
                    >
                      <img
                        src={doc.url}
                        alt={`Document ${idx + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <BadgeCheck className="w-6 h-6 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SUSPENDED ALERT ================= */}
            {supplier.isSuspended && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                <AlertCircle className="w-5 h-5" />
                This supplier account is currently suspended.
              </div>
            )}

            {/* ================= ACTION FOOTER ================= */}
            <div className="sticky bottom-0 bg-white pt-4 border-t flex gap-3">
              {!supplier.isSuspended && (
                <Button
                  variant="destructive"
                  onClick={handleSuspend}
                  disabled={isSuspending}
                  className="flex-1"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Suspend Supplier
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No details available for this supplier.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuppliersModels;
