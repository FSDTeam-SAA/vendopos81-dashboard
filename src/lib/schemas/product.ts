import { z } from "zod";

export const variantSchema = z.object({
  label: z.string().min(1, "Label is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  unit: z.string().min(1, "Unit is required"),
  discount: z.coerce.number().min(0),
});

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  productName: z.string().min(1, "Product Name is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  productType: z.string().min(1, "Product Type is required"),
  originCountry: z.string().min(1, "Region/Country is required"),
  shelfLife: z.string().min(1, "Shelf Life is required"),
  isHalal: z.boolean(),
  isOrganic: z.boolean(),
  isFrozen: z.boolean(),
  isKosher: z.boolean(),
  isFeatured: z.boolean(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
  images: z.any().optional(),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
