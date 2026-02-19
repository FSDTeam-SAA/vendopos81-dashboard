/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAllCategories } from "@/lib/hooks/useCategory";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/useProduct";
import {
  CreateProductFormValues,
  createProductSchema,
} from "@/lib/schemas/product";
import { Product, ProductImage } from "@/lib/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddProductModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  product?: Product | null;
}

export function AddProductModal({
  onClose,
  onSuccess,
  product,
}: AddProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>(
    product?.images || [],
  );

  // Sync existing images when product prop changes (handling remounts or updates)
  useEffect(() => {
    if (product) {
      setExistingImages(product.images || []);
    } else {
      setExistingImages([]);
    }
  }, [product]);

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useAllCategories();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState, // Access full formState
    reset,
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(
      createProductSchema,
    ) as Resolver<CreateProductFormValues>,
    defaultValues: {
      variants: [
        { label: "Default", price: 0, stock: 0, unit: "pcs", discount: 0 },
      ],
      isHalal: false,
      isOrganic: false,
      isFrozen: false,
      isKosher: false,
      isFeatured: false,
      title: "",
      productName: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      productType: "",
      originCountry: "",
      shelfLife: "",
    },
  });

  const { errors } = formState;

  // Determine the default category ID from the product
  const defaultCategoryId = useMemo(() => {
    if (!product?.categoryId) return "";
    if (
      typeof product.categoryId === "object" &&
      (product.categoryId as any)._id
    ) {
      return (product.categoryId as any)._id;
    }
    return String(product.categoryId);
  }, [product]);

  // Initialize form with product data if available
  useEffect(() => {
    if (product) {
      // Explicitly map the values to ensure undefined/nulls are handled
      reset({
        title: product.title || "",
        productName: product.productName || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        categoryId: defaultCategoryId,
        productType: product.productType || "",
        originCountry: product.originCountry || "",
        shelfLife: product.shelfLife || "",
        isHalal: product.isHalal || false,
        isOrganic: product.isOrganic || false,
        isFrozen: product.isFrozen || false,
        isKosher: product.isKosher || false,
        isFeatured: product.isFeatured || false,
        variants: product.variants?.length
          ? product.variants.map((v) => ({
              label: v.label,
              price: v.price,
              stock: v.stock,
              unit: v.unit,
              discount: v.discount || 0,
            }))
          : [
              {
                label: "Default",
                price: 0,
                stock: 0,
                unit: "pcs",
                discount: 0,
              },
            ],
      });
    } else {
      // Reset to defaults if no product (Add mode)
      reset({
        variants: [
          { label: "Default", price: 0, stock: 0, unit: "pcs", discount: 0 },
        ],
        isHalal: false,
        isOrganic: false,
        isFrozen: false,
        isKosher: false,
        isFeatured: false,
        title: "",
        productName: "",
        description: "",
        shortDescription: "",
        categoryId: "",
        productType: "",
        originCountry: "",
        shelfLife: "",
      });
    }
  }, [product, reset, defaultCategoryId]);

  // Watch category ID to filter/populate other fields
  const selectedCategoryId = watch("categoryId");

  const selectedCategory = useMemo(() => {
    const cats = (categoriesData as any)?.data || [];
    return cats.find((c: any) => c._id === selectedCategoryId);
  }, [categoriesData, selectedCategoryId]);

  // Update dependent fields when category changes
  useEffect(() => {
    if (selectedCategory) {
      // If the user manually changed the category, or if we are setting up initial state
      // We want to ensure productType syncs.

      const currentProductType = watch("productType");

      // Only update productType if it's different to avoid unnecessary writes
      if (currentProductType !== selectedCategory.productType) {
        setValue("productType", selectedCategory.productType);
      }

      // Only clear dependent fields if the category was explicitly changed by the user (is dirty)
      // AND it's not the initial load (which we can infer if the form is dirty)
      if (formState.dirtyFields.categoryId) {
        setValue("originCountry", "");
        // Clearing productName might be annoying if the new category has the same product names,
        // but typically it's better to clear invalid selections.
        setValue("productName", "");
      }
    }
  }, [selectedCategory, setValue, formState.dirtyFields.categoryId, watch]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files]);
      // Only set images field for validation if needed, though schema is optional for updates involving existing images
      setValue("images", [...imageFiles, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      setValue("images", newFiles);
      return newFiles;
    });
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    // Note: Backend integration for deleting existing images might require a separate field (e.g., deletedImageIds)
    // or the backend might sync with the provided list.
    // Since we only send 'images' (new files) in FormData, deletion of existing images depends on backend implementation.
    // For now, we update the UI state.
  };

  const onSubmit = async (data: CreateProductFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("productName", data.productName);
      formData.append("description", data.description);
      formData.append("shortDescription", data.shortDescription);
      formData.append("categoryId", data.categoryId);
      formData.append("productType", data.productType);
      formData.append("originCountry", data.originCountry);
      formData.append("shelfLife", data.shelfLife);

      formData.append("isHalal", String(data.isHalal));
      formData.append("isOrganic", String(data.isOrganic));
      formData.append("isFrozen", String(data.isFrozen));
      formData.append("isKosher", String(data.isKosher));
      formData.append("isFeatured", String(data.isFeatured));

      data.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][label]`, variant.label);
        formData.append(`variants[${index}][price]`, String(variant.price));
        formData.append(`variants[${index}][stock]`, String(variant.stock));
        formData.append(`variants[${index}][unit]`, variant.unit);
        formData.append(
          `variants[${index}][discount]`,
          String(variant.discount || 0),
        );
      });

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (product) {
        await updateMutation.mutateAsync({ id: product._id, formData });
        toast.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Product created successfully");
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        product ? "Failed to update product" : "Failed to create product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {product
                ? "Update product data to keep your catalog accurate and up to date."
                : "Add a new product to your catalog with complete details and stock information."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  {...register("title")}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. Organic Olive Oil"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category (Product Type)
                </label>
                <select
                  {...register("categoryId")}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Category</option>
                  {(categoriesData as any)?.data?.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.productType}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
                {isLoadingCategories && (
                  <p className="text-xs text-gray-400 mt-1">
                    Loading categories...
                  </p>
                )}
              </div>

              {/* Dependent Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Region (Read-only / Display) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Region
                  </label>
                  <input
                    type="text"
                    value={selectedCategory?.region || ""}
                    readOnly
                    className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    placeholder="Select Category First"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    {...register("originCountry")}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                    disabled={!selectedCategoryId}
                  >
                    <option value="">Select Country</option>
                    {selectedCategory?.country?.map((c: string) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.originCountry && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.originCountry.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Name / Sub Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name / Sub-Category
                </label>
                <select
                  {...register("productName")}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  disabled={!selectedCategoryId}
                >
                  <option value="">Select Product Name</option>
                  {selectedCategory?.productName?.map((name: string) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.productName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              {/* Shelf Life */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shelf Life
                </label>
                <input
                  {...register("shelfLife")}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. 7 days"
                />
                {errors.shelfLife && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.shelfLife.message}
                  </p>
                )}
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                Description
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <input
                  {...register("shortDescription")}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="Brief summary"
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="Detailed description..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Images
            </h3>
            <div className="flex items-start gap-4 flex-wrap">
              <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-2">Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
              </label>
              {/* Existing Images */}
              {existingImages.map((img, idx) => (
                <div
                  key={`existing-${img._id}`}
                  className="relative w-32 h-32 border rounded-lg overflow-hidden group"
                >
                  <Image
                    width={128}
                    height={128}
                    src={img.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 py-0.5 text-center">
                    Existing
                  </div>
                </div>
              ))}

              {/* New Images */}
              {newImagePreviews.map((src, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative w-32 h-32 border rounded-lg overflow-hidden group"
                >
                  <Image
                    width={128}
                    height={128}
                    src={src}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500/50 text-white text-[10px] px-1 py-0.5 text-center">
                    New
                  </div>
                </div>
              ))}
            </div>
            {errors.images?.message && (
              <p className="text-red-500 text-xs">
                {String(errors.images.message)}
              </p>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Attributes
            </h3>
            <div className="flex flex-wrap gap-6">
              {[
                "isHalal",
                "isOrganic",
                "isFrozen",
                "isKosher",
                "isFeatured",
              ].map((field) => (
                <label
                  key={field}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    {...register(field as keyof CreateProductFormValues)}
                    className="w-4 h-4 rounded border-gray-300 text-[#1B7D6E] focus:ring-[#1B7D6E]"
                  />
                  <span className="text-sm font-medium capitalize">
                    {field.replace("is", "")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-gray-900">Variants</h3>
              <button
                type="button"
                onClick={() =>
                  append({
                    label: "",
                    price: 0,
                    stock: 0,
                    unit: "kg",
                    discount: 0,
                  })
                }
                className="text-sm text-[#1B7D6E] flex items-center gap-1 font-medium"
              >
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-gray-50 p-4 rounded-lg relative"
              >
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Label
                  </label>
                  <input
                    {...register(`variants.${index}.label`)}
                    placeholder="e.g. 1kg Pack"
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                  {errors.variants?.[index]?.label && (
                    <p className="text-red-500 text-xs">
                      {errors.variants[index]?.label?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`variants.${index}.price`)}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                  {errors.variants?.[index]?.price && (
                    <p className="text-red-500 text-xs">
                      {errors.variants[index]?.price?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Stock
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.stock`)}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Unit
                  </label>
                  <input
                    {...register(`variants.${index}.unit`)}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                </div>
                <div className="relative">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Discount
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.discount`)}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute -right-3 -top-3 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {errors.variants?.root?.message && (
              <p className="text-red-500 text-xs">
                {errors.variants.root.message}
              </p>
            )}
            {errors.variants?.message && (
              <p className="text-red-500 text-xs">
                {String(errors.variants.message)}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1B7D6E] text-white rounded-lg hover:bg-[#155D5C] disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting
                ? "Saving..."
                : product
                  ? "Save Changes"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
