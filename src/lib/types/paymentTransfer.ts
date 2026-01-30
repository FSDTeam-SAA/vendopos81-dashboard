export interface OrderInfo {
  _id: string;
  paymentStatus: string;
  orderStatus: string;
}

export interface SupplierInfo {
  _id: string;
  shopName: string;
  brandName: string;
  email: string;
}

export interface Settlement {
  _id: string;
  orderId: OrderInfo;
  supplierId: SupplierInfo;
  paymentId: string;
  totalAmount: number;
  adminCommission: number;
  payableAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalPending: number;
  totalTransferred: number;
  totalRequested: number;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SettlementsData {
  data: Settlement[];
  analytics: Analytics;
  meta: Meta;
}

export interface SupplierSettlementsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: SettlementsData;
}