/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/lib/types/product";
import { Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

interface ViewProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  handleEdit: (product: Product) => void;
}

export const ViewProductModal = ({
  product,
  isOpen,
  onClose,
  handleEdit,
}: ViewProductModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: session } = useSession();

  if (!product) return null;
  const isAdmin = session?.user?.role === "admin";

  const canEdit = isAdmin && product.isVendorBrand === true;
  const canDelete = isAdmin;

  const handleDelete = () => {
    console.log("Delete Product:", product._id);
    setIsDeleteOpen(false);
    onClose();
  };

  // Reset image error when modal opens or image index changes
  const handleImageIndexChange = (idx: number) => {
    setSelectedImageIndex(idx);
    setImageError(false);
  };

  return (
    <>
      {/* ================= MAIN MODAL ================= */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2 mt-3 relative top-0 bg-white z-10">
            <DialogTitle className="text-xl font-bold text-gray-800 pr-24">
              {product.productName}

            </DialogTitle>

            <DialogDescription className="text-sm text-gray-600">
              {product.shortDescription}
            </DialogDescription>

            {/* ===== ADMIN CONTROLS ===== */}
            {isAdmin && (
              <div className="absolute right-6 top-7 flex gap-3">
                {/* Show edit button ONLY when canEdit is true */}
                {canEdit && (
                  <button
                    className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 transition"
                    onClick={() => {
                      handleEdit(product);
                      onClose();
                    }}
                  >
                    <Pencil className="w-4 h-4 text-blue-700 cursor-pointer" />
                  </button>
                )}

                {/* Show delete button when canDelete is true */}
                {canDelete && (
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-700 cursor-pointer" />
                  </button>
                )}
              </div>
            )}
          </DialogHeader>

          <div className="flex flex-col gap-6 mt-4">
            {/* ===== TOP: IMAGE SECTION ===== */}
            <div className="w-full">
              <div className="flex flex-col gap-2">
                {/* Main Image */}
                <div className="relative w-full h-50 rounded-lg overflow-hidden">
                  {product.images &&
                  product.images.length > 0 &&
                  !imageError ? (
                    <Image
                      src={product.images[selectedImageIndex]?.url || ""}
                      alt={product.productName}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-contain"
                      priority
                      onError={() => setImageError(true)}
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400">
                      <svg
                        className="w-16 h-16 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-lg">No Image Available</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleImageIndexChange(idx)}
                        className={`relative w-20 h-20 rounded-md overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 ${
                          selectedImageIndex === idx
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ===== BOTTOM: DETAILS SECTION ===== */}
            <div className="w-full space-y-4">
              {/* Badges Section */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="default"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border-0 px-3 py-1.5 text-sm font-semibold"
                >
                  {product.productType}
                </Badge>

                {product.isOrganic && (
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 text-xs font-medium gap-1"
                  >
                    <span className="text-green-600">🌱</span> Organic
                  </Badge>
                )}

                {product.isHalal && (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 text-xs font-medium gap-1"
                  >
                    <span className="text-emerald-600">☪️</span> Halal
                  </Badge>
                )}

                {product.isKosher && (
                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 text-xs font-medium gap-1"
                  >
                    <span className="text-blue-600"></span> Kosher
                  </Badge>
                )}

                {product.isFrozen && (
                  <Badge
                    variant="outline"
                    className="border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 px-3 py-1.5 text-xs font-medium gap-1"
                  >
                    <span className="text-cyan-600">❄️</span> Frozen
                  </Badge>
                )}
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Region</p>
                  <p className="font-medium text-gray-900">
                    {product.category?.region || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Origin Country</p>
                  <p className="font-medium text-gray-900">
                    {product.originCountry || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">Status :</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {product.status?.toUpperCase() || "N/A"}
                  </span>
                </div>
              </div>

              {/* Variants Section */}
              {product.variants?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span>📦</span> Product Variants ({product.variants.length})
                  </h4>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Variant
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Discount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {product.variants.map((v: any) => (
                            <tr
                              key={v._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {v.label}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {v.unit}
                              </td>
                              <td className="px-4 py-3">
                                {v.discount > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-primary">
                                      ${v.discountPrice}
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                      ${v.price}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-semibold">
                                    ${v.price}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {v.discount > 0 ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {v.discount}% OFF
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center gap-1 ${
                                    v.stock > 0
                                      ? "text-green-800"
                                      : "text-red-600"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      v.stock > 0
                                        ? "bg-green-700"
                                        : "bg-red-500"
                                    }`}
                                  ></span>
                                  {v.stock > 0 ? v.stock : "Out of Stock"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Supplier Information */}
              {product.supplier && (
                <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                    Supplier Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Shop Name</p>
                      <p className="font-medium text-gray-800">
                        {product.supplier.shopName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Brand</p>
                      <p className="font-medium text-primary">
                        {product.supplier.brandName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Debug Info - Hidden by default, only shown if needed */}
              {product.isVendorBrand &&
                process.env.NODE_ENV === "development" && (
                  <div className="mt-3 p-3 rounded-xl border border-dashed border-green-800 bg-amber-50 shadow-sm">
                    <div className="flex items-start gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-800 text-amber-700 text-xs font-bold"></div>

                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-green-700">
                          Vendor Brand
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {canDelete && (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-sm rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Product
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
