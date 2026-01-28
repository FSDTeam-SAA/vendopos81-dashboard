// Reuse your existing types where applicable
export interface ProductImage {
  public_id: string;
  url: string;
  _id: string;
}

export interface ProductVariant {
  label: string;
  price: number;
  stock: number;
  unit: string;
  discount: number;
  discountPrice: number;
  _id: string;
}

export interface Category {
  _id: string;
  region: string;
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
}

// Main Product interface (updated with all fields from your data)
export interface BestsellingSingleProduct {
  _id: string;
  userId: string;
  categoryId: Category; // Object, not string/null in this case
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
  discountPriceFrom: number;
  showOnlyDiscount: number;
  shelfLife: string;
  originCountry: string;
  isHalal: boolean;
  isOrganic: boolean;
  isFrozen: boolean;
  isKosher: boolean;
  isVendorBrand: boolean;
  isPallet: boolean;
  isCase: boolean;
  seo: ProductSEO;
  averageRating: number;
  totalRatings: number;
  status: 'pending' | 'approved' | 'rejected' | 'draft'; // Based on common statuses
  isFeatured: boolean;
  isAvailable: boolean;
  quantity: number;
  wholesaleId: string[];
  addBy: 'admin' | 'supplier'; // Based on common values
  createdAt: string;
  updatedAt: string;
}

// Response type for getting a single bestselling product
export interface GetBestsellingSingleProductResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: BestsellingSingleProduct;
}