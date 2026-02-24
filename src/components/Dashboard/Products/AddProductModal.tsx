/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAllCategories, useGetAllRegions } from "@/lib/hooks/useCategory";
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

  // Sync existing images when product prop changes
  useEffect(() => {
    if (product) setExistingImages(product.images || []);
    else setExistingImages([]);
  }, [product]);

  // Fetch regions-----------------------------------
  const { data: allRegion } = useGetAllRegions();

  // Form setup
  const { register, control, handleSubmit, setValue, watch, formState, reset } =
    useForm<CreateProductFormValues>({
      resolver: zodResolver(
        createProductSchema,
      ) as Resolver<CreateProductFormValues>,
      defaultValues: {
        variants: [
          { label: "", price: 0, stock: 0, unit: "", discount: 0 },
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

  // Watch region and productType
  const selectedRegion = watch("categoryId");
  const selectedProductType = watch("productType");

  useEffect(() => {
    setValue("productName", "");
  }, [selectedProductType, setValue]);

  // Fetch categories with selected filters
  const params = useMemo(
    () => ({
      region: selectedRegion || undefined,
      productType: selectedProductType || undefined,
    }),
    [selectedRegion, selectedProductType],
  );

  console.log({ selectedProductType, selectedRegion });

  const { data: categoriesData } = useAllCategories(params);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

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

  // Initialize form with product data
  useEffect(() => {
    if (product) {
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
        // region: product.region || "",
      });
    }
  }, [product, reset, defaultCategoryId]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Image handlers
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files]);
      setValue("images", [...imageFiles, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };
  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit handler
  const onSubmit = async (data: CreateProductFormValues) => {
    console.log("Form Data:", data);
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

      imageFiles.forEach((file) => formData.append("images", file));

      if (product) {
        console.log("Updating product...");
        await updateMutation.mutateAsync({ id: product._id, formData });
        toast.success("Product updated successfully");
      } else {
        console.log("Creating product...");
        await createMutation.mutateAsync(formData);
        toast.success("Product created successfully");
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl my-10 rounded-2xl shadow-xl border border-gray-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              {product
                ? "Update product information and keep your catalog accurate."
                : "Add a new product with complete information and stock details."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
          {/* ================= BASIC INFO ================= */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                  Title
                </label>
                <input
                  {...register("title")}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
                  placeholder="e.g. Organic Olive Oil"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/*=========================== Region=================== */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                  Region
                </label>

                <select
                  {...register("categoryId")}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
                >
                  <option value="">Select Region</option>

                  {allRegion?.data?.map((item: any) => (
                    <option key={item._id} value={item._id}>
                      {item.region.trim()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                  Category
                </label>

                <select
                  {...register("productType")}
                  disabled={!categoriesData?.filters?.productTypes?.length}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition disabled:bg-gray-100"
                >
                  <option value="">Select Category</option>

                  {categoriesData?.filters?.productTypes?.map(
                    (type: string) => {
                      const category =
                        categoriesData?.data?.[0]?.categories?.find(
                          (c: any) => c.productType === type,
                        );

                      return (
                        <option key={category?._id} value={category?._id}>
                          {type}
                        </option>
                      );
                    },
                  )}
                </select>
              </div>

              {/* ================= PRODUCT NAMES ================= */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                  Sub-Category
                </label>
                <select
                  {...register("productName")}
                  disabled={!categoriesData?.filters?.productNames?.length}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition disabled:bg-gray-100"
                >
                  <option value="">Select Sub-Category</option>
                  {categoriesData?.filters?.productNames?.map(
                    (name: string) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* =========================== Country */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                  Select Country
                </label>
                <select
                  {...register("originCountry")}
                  disabled={!categoriesData?.data?.[0]?.country?.length}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition disabled:bg-gray-100"
                >
                  <option value="">Select Country</option>
                  {categoriesData?.data?.[0]?.country?.map((name: string) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shelf Life */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                  Shelf Life
                </label>
                <input
                  {...register("shelfLife")}
                  placeholder="e.g. 7 days"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
                />
              </div>
            </div>
          </div>

          {/* ================= DESCRIPTION ================= */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Description
            </h3>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                Short Description
              </label>
              <input
                {...register("shortDescription")}
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                Full Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
              />
            </div>
          </div>

          {/* ================= IMAGES ================= */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Images
            </h3>
            <div className="flex items-start gap-4 flex-wrap">
              {/* Upload New */}
              <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-[#1B7D6E] transition">
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
                  className="relative w-32 h-32 border rounded-xl overflow-hidden group shadow-sm"
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
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
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
                  className="relative w-32 h-32 border rounded-xl overflow-hidden group shadow-sm"
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
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500/50 text-white text-[10px] px-1 py-0.5 text-center">
                    New
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= ATTRIBUTES ================= */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Attributes
            </h3>
            <div className="flex flex-wrap gap-6">
              {["isHalal", "isOrganic", "isFrozen", "isKosher"].map((field) => (
                <label
                  key={field}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    {...register(field as keyof CreateProductFormValues)}
                    className="w-4 h-4 text-[#1B7D6E] rounded border-gray-300 focus:ring-[#1B7D6E]"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {field.replace("is", "")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ================= VARIANTS ================= */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Variants
              </h3>
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
                className="text-sm text-[#1B7D6E] flex items-center gap-1 cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-white border border-gray-200 rounded-xl p-4 relative"
              >
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Label
                  </label>
                  <input
                    {...register(`variants.${index}.label`)}
                    placeholder="e.g. 1kg Pack"
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`variants.${index}.price`)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Stock
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.stock`)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Unit
                  </label>
                  <input
                    {...register(`variants.${index}.unit`)}
                    placeholder="kg, Liter, g, etc"
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
                  />
                </div>
                <div className="relative">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Discount
                  </label>
                  <input
                    type="number"
                    {...register(`variants.${index}.discount`)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 focus:border-[#1B7D6E] focus:ring-2 focus:ring-[#1B7D6E]/10 transition"
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
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="pt-4 flex justify-end gap-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-11 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 h-11 bg-[#1B7D6E] text-white rounded-lg hover:opacity-90 transition flex cursor-pointer items-center gap-2"
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
