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
import Image from "next/image";
import { useState } from "react";

interface ViewProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

//! there i have to check in session that user is admin or not. I have to check it in session

export const ViewProductModal = ({
  product,
  isOpen,
  onClose,
}: ViewProductModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  if (!product) return null;

  // 🔐 Business Rules
  const canEdit = !product.isVendorBrand;
  const canDelete = !product.isVendorBrand;

  console.log({ "this is canDelete": canDelete, canEdit });

  const handleEditClick = () => {
    setEditedName(product.productName);
    setEditedDescription(product.shortDescription);
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("Updated Product:", {
      name: editedName,
      description: editedDescription,
    });

    // 👉 এখানে update API call করবে
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log("Delete Product:", product._id);

    // 👉 এখানে delete API call করবে
    setIsDeleteOpen(false);
    onClose();
  };

  return (
    <>
      {/* ================= MAIN MODAL ================= */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl w-full rounded-xl shadow-lg">
          <DialogHeader className="pb-2 relative">
            <DialogTitle className="text-xl font-bold text-gray-800">
              {isEditing ? (
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                product.productName
              )}
            </DialogTitle>

            <DialogDescription className="text-sm text-gray-600">
              {isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                product.shortDescription
              )}
            </DialogDescription>

            {/* ===== ADMIN CONTROLS ===== */}
            {canEdit && (
              <div className="absolute right-6 top-6 flex gap-3">
                {canEdit && !isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 transition"
                  >
                    <Pencil className="w-4 h-4 text-blue-700" />
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-700" />
                  </button>
                )}

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md"
                  >
                    Save
                  </button>
                )}
              </div>
            )}
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-6 mt-4">
            {/* ===== LEFT: IMAGE SECTION ===== */}
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                {product.images?.[selectedImageIndex]?.url ? (
                  <Image
                    src={product.images[selectedImageIndex].url}
                    alt={product.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-green-600"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${idx}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ===== RIGHT: DETAILS ===== */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{product.productType}</Badge>
                {product.isOrganic && <Badge>Organic</Badge>}
                {product.isHalal && <Badge>Halal</Badge>}
                {product.isKosher && <Badge>Kosher</Badge>}
                {product.isFrozen && <Badge>Frozen</Badge>}
              </div>

              <p>
                <strong>Region:</strong> {product.category?.region}
              </p>

              <p>
                <strong>Origin Country:</strong> {product.originCountry}
              </p>

              {product.variants?.length > 0 && (
                <div className="mt-4 p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v: any) => (
                      <Badge key={v._id} variant="outline">
                        {v.name} ({v.unit}) - ${v.price}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.supplier && (
                <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-1">Supplier Information</h4>
                  <p>
                    <strong>Shop Name:</strong> {product.supplier.shopName}
                  </p>
                  <p>
                    <strong>Brand:</strong> {product.supplier.brandName}
                  </p>
                </div>
              )}

              <div className="mt-2">
                <strong>Status:</strong>{" "}
                <span className="px-3 py-1 rounded-full border text-sm font-semibold bg-gray-100">
                  {product.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {canDelete && (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-sm rounded-xl">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-3 py-1 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
