
export interface ProductParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryRegion?: string;
  originCountry?: string;
  supplierBrand?: string;
  sort?: string;
}

export interface ProductImage {
  public_id: string;
  url: string;
  _id: string;
}

export interface ProductVariant {
  discount: number;
  label: string;
  price: number;
  stock: number;
  unit: string;
  _id: string;
  discountPrice?: number;
}

export interface ProductVariantInput {
  label: string;
  price: number;
  stock: number;
  unit: string;
  discount: number;
}

export interface Category {
  _id: string;
  region: string;
}

export interface Product {
  _id: string;
  userId: string;
  categoryId: Category | string; 
  supplierId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  productType: string;
  productName: string;
  variants: ProductVariant[];
  priceFrom: number;
  shelfLife: string;
  originCountry: string;
  isHalal: boolean;
  isOrganic: boolean;
  isFrozen: boolean;
  isKosher: boolean;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
  quantity: number;
  sales?: number;
  revenue?: number | string;
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Product[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Product;
}
