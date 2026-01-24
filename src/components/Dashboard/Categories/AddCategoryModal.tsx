"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Loader2, ImageIcon, Pencil } from "lucide-react";
import { useCreateCategory, useUpdateCategory } from "@/lib/hooks/useCategory";
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/lib/types/category";
import StatusModal from "./StatusModal";
import Image from "next/image";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null; // If provided, modal is in edit mode
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
}: CategoryModalProps) {
  const isEditMode = !!category;

  const [region, setRegion] = useState("");
  const [productType, setProductType] = useState("");
  const [productNames, setProductNames] = useState<string[]>([""]);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [regionImage, setRegionImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(
    null
  );
  const [regionImagePreview, setRegionImagePreview] = useState<string | null>(
    null
  );
  
  // Status Modal State
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    status: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    status: "success",
    title: "",
    message: "",
  });

  const productImageRef = useRef<HTMLInputElement>(null);
  const regionImageRef = useRef<HTMLInputElement>(null);

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isPending = isCreating || isUpdating;

  const resetForm = () => {
    setRegion("");
    setProductType("");
    setProductNames([""]);
    setProductImage(null);
    setRegionImage(null);
    setProductImagePreview(null);
    setRegionImagePreview(null);
  };

  // Populate form with existing category data when in edit mode
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setRegion(category.region || "");
        setProductType(category.productType || "");
        setProductNames(
          category.productName?.length > 0 ? category.productName : [""]
        );
        // Set existing image previews from URLs
        setProductImagePreview(category.productImage?.url || null);
        setRegionImagePreview(category.regionImage?.url || null);
        // Reset file inputs
        setProductImage(null);
        setRegionImage(null);
      } else {
        // Reset form when opening in create mode
        resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, category?._id]);

  const handleAddProductName = () => {
    setProductNames([...productNames, ""]);
  };

  const handleRemoveProductName = (index: number) => {
    if (productNames.length > 1) {
      setProductNames(productNames.filter((_, i) => i !== index));
    }
  };

  const handleProductNameChange = (index: number, value: string) => {
    const updated = [...productNames];
    updated[index] = value;
    setProductNames(updated);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "region"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "product") {
          setProductImage(file);
          setProductImagePreview(reader.result as string);
        } else {
          setRegionImage(file);
          setRegionImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showStatus = (status: "success" | "error", title: string, message: string) => {
    setStatusModal({ isOpen: true, status, title, message });
  };

  const closeStatusModal = () => {
    setStatusModal((prev) => ({ ...prev, isOpen: false }));
    if (statusModal.status === "success") {
      onClose(); // Close main modal only on success
      resetForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty product names
    const filteredProductNames = productNames.filter(
      (name) => name.trim() !== ""
    );

    if (!region.trim()) {
      showStatus("error", "Validation Error", "Region is required");
      return;
    }
    if (!productType.trim()) {
      showStatus("error", "Validation Error", "Product type is required");
      return;
    }
    if (filteredProductNames.length === 0) {
      showStatus("error", "Validation Error", "At least one product name is required");
      return;
    }

    if (isEditMode && category) {
      // Update existing category
      const payload: UpdateCategoryPayload = {
        _id: category._id,
        region: region.trim(),
        productType: productType.trim(),
        productName: filteredProductNames,
        productImage: productImage || undefined,
        regionImage: regionImage || undefined,
      };

      updateCategory(payload, {
        onSuccess: () => {
          showStatus(
            "success",
            "Category Updated",
            `Category "${region} - ${productType}" has been successfully updated.`
          );
        },
        onError: (err) => {
          const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            err.message ||
            "Failed to update category. Please try again.";
          showStatus("error", "Update Failed", errorMessage);
        },
      });
    } else {
      // Create new category
      const payload: CreateCategoryPayload = {
        region: region.trim(),
        productType: productType.trim(),
        productName: filteredProductNames,
        productImage: productImage || undefined,
        regionImage: regionImage || undefined,
      };

      createCategory(payload, {
        onSuccess: () => {
          showStatus(
            "success",
            "Category Created",
            `Category "${region} - ${productType}" has been successfully created.`
          );
        },
        onError: (err) => {
          const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            err.message ||
            "Failed to create category. Please try again.";
          showStatus("error", "Creation Failed", errorMessage);
        },
      });
    }
  };

  const handleClose = () => {
    if (!isPending) {
      resetForm();
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {isEditMode ? (
                <>
                  <Pencil className="w-5 h-5 text-[#086646]" />
                  Edit Category
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-[#086646]" />
                  Add New Category
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium">
                Region <span className="text-red-500">*</span>
              </Label>
              <Input
                id="region"
                placeholder="e.g., Russia, Asia, Europe"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Product Type */}
            <div className="space-y-2">
              <Label htmlFor="productType" className="text-sm font-medium">
                Product Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productType"
                placeholder="e.g., Cooking Oil, Spices"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Product Names */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Product Names <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                {productNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Product name ${index + 1}`}
                      value={name}
                      onChange={(e) =>
                        handleProductNameChange(index, e.target.value)
                      }
                      disabled={isPending}
                    />
                    {productNames.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveProductName(index)}
                        disabled={isPending}
                        className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddProductName}
                  disabled={isPending}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product Name
                </Button>
              </div>
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-2 gap-4">
              {/* Product Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Product Image</Label>
                <input
                  ref={productImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "product")}
                  disabled={isPending}
                />
                <div
                  onClick={() => !isPending && productImageRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#086646] hover:bg-[#086646]/5 transition-colors"
                >
                  {productImagePreview ? (
                    <div className="relative">
                      <img
                        src={productImagePreview}
                        alt="Product preview"
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductImage(null);
                          setProductImagePreview(null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Region Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Region Image</Label>
                <input
                  ref={regionImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "region")}
                  disabled={isPending}
                />
                <div
                  onClick={() => !isPending && regionImageRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#086646] hover:bg-[#086646]/5 transition-colors"
                >
                  {regionImagePreview ? (
                    <div className="relative">
                      <Image
                        width={500}
                        height={500}
                        src={regionImagePreview}
                        alt="Region preview"
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegionImage(null);
                          setRegionImagePreview(null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#086646] hover:bg-[#065535] text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success/Error Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={closeStatusModal}
        status={statusModal.status}
        title={statusModal.title}
        message={statusModal.message}
      />
    </>
  );
}
