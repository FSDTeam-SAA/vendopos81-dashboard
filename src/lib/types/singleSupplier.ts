export interface SupplierImage {
  public_id: string;
  url: string;
  _id?: string; // Optional since logo doesn't have _id, but documentUrl does
}

export interface SupplierUser {
  _id: string;
  email: string;
  phone: string;
}

export interface Supplier {
  _id: string;
  userId: SupplierUser;
  shopName: string;
  brandName: string;
  shopSlug: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended'; 
  email: string;
  warehouseLocation: string;
  address: string;
  location: string;
  street: string;
  postalCode: string;
  logo: SupplierImage;
  documentUrl: SupplierImage[];
  rating: number;
  totalSales: number;
  totalOrders: number;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetSupplierResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Supplier;
}