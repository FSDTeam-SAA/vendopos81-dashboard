import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, ShoppingBag, DollarSign, Building2, Phone, MapPin, FileText, Store, BadgeCheck, AlertCircle } from "lucide-react";
import { useReportTopSuppliersSingle } from "@/lib/hooks/useReport";
import { Supplier } from "@/lib/types/singleSupplier";

interface ViewModalProps {
  viewModalOpen: boolean;
  setViewModalOpen: (open: boolean) => void;
  id: string;
}

const ViewModal = ({ viewModalOpen, setViewModalOpen, id }: ViewModalProps) => {
  const { data, isLoading } = useReportTopSuppliersSingle(id);
  const supplier: Supplier | undefined = data?.data;

  if (!id) return null;

  return (
    <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="w-5 h-5 text-teal-600" />
            Supplier Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : supplier ? (
          <div className="space-y-6 py-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-sm overflow-hidden border border-gray-100">
                {supplier.logo?.url ? (
                  <img
                    src={supplier.logo.url}
                    alt={supplier.shopName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-xl text-gray-900">{supplier.shopName}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
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
                <p className="text-gray-600 font-medium">{supplier.brandName}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-yellow-600 flex items-center">
                        {supplier.rating} ★
                    </span>
                    <span>• {supplier.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Info</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{supplier.userId?.email || supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{supplier.userId?.phone || "N/A"}</span>
                    </div>
                </div>
              </div>

              {/* Business Stats */}
              <div className="space-y-3">
                 <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Performance</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium uppercase">Orders</p>
                        <p className="text-lg font-bold text-blue-900">{supplier.totalOrders}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <p className="text-xs text-green-600 font-medium uppercase">Sales</p>
                        <p className="text-lg font-bold text-green-900">${supplier.totalSales?.toLocaleString() || supplier.totalOrders /* Fallback if sales missing in one view */}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Location & Address</h4>
                <div className="bg-white border rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 text-xs">Street Address</p>
                        <p className="font-medium text-gray-900">{supplier.street || supplier.address}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">City / Location</p>
                        <p className="font-medium text-gray-900">{supplier.location}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Postal Code</p>
                        <p className="font-medium text-gray-900">{supplier.postalCode}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Warehouse</p>
                        <p className="font-medium text-gray-900">{supplier.warehouseLocation}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            {supplier.description && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">About</h4>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border">
                        {supplier.description}
                    </p>
                </div>
            )}

            {/* Documents */}
            {supplier.documentUrl && supplier.documentUrl.length > 0 && (
                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        <FileText className="w-4 h-4" /> Documents
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {supplier.documentUrl.map((doc, idx) => (
                            <a 
                                key={idx} 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border hover:border-teal-500 transition-colors"
                            >
                                <img src={doc.url} alt={`Document ${idx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="bg-white/90 p-1.5 rounded-full shadow-sm">
                                        <BadgeCheck className="w-4 h-4 text-teal-600" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
            
            {supplier.isSuspended && (
                 <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
                    <AlertCircle className="w-5 h-5" />
                    Checking this supplier account is currently suspended.
                 </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No details available for this supplier.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;