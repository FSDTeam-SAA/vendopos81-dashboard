// Category Types

export interface CategoryImage {
  public_id: string;
  url: string;
}

export interface Category {
  _id: string;
  region: string;
  slug: string;
  productType: string;
  productName: string[];
  country: string[];
  productImage?: CategoryImage;
  regionImage?: CategoryImage;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
  filters?: {
    productNames: string[];
    productTypes: string[];
  };
  data: Category[];
  meta: CategoryMeta;
}

export interface CategoryParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  productType?: string;
}

export interface CreateCategoryPayload {
  region: string;
  productType: string;
  productName: string[];
  productImage?: File;
  regionImage?: File;
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Category;
}

export interface UpdateCategoryPayload extends CreateCategoryPayload {
  _id: string;
}
