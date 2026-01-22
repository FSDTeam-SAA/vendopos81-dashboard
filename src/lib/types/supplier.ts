export interface CloudinaryImage {
  public_id: string;
  url: string;
}

export interface SupplierUser {
  email: string;
  phone: string;
  _id: string;
}

export interface SupplierDocument {
  public_id: string;
  url: string;
  _id: string;
}

export interface Supplier {
  _id: string;
  address: string;
  brandName: string;
  createdAt: string;
  description: string;
  documentUrl: SupplierDocument[];
  email: string;
  isSuspended: boolean;
  location: string;
  logo: CloudinaryImage;
  postalCode: string;
  rating: number;
  shopName: string;
  shopSlug: string;
  status: string;
  street: string;
  totalOrders: number;
  totalSales: number;
  updatedAt: string;
  userId: SupplierUser | null;
  warehouseLocation: string;
}

export interface Analytics {
  totalActive: number;
  totalPending: number;
  totalProducts: number;
  totalSupplier: number;
}

export interface Meta {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
}

export interface SupplierResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Supplier[];
  analytics: Analytics;
  meta: Meta;
}