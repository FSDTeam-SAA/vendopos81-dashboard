export interface OrderUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface BillingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface ProductImage {
  public_id: string;
  url: string;
  _id: string;
}

export interface OrderProduct {
  _id: string;
  title: string;
  slug: string;
  images: ProductImage[];
}

export interface SupplierLogo {
  public_id: string;
  url: string;
}

export interface OrderSupplier {
  _id: string;
  shopName: string;
  brandName: string;
  logo: SupplierLogo;
}

export interface VariantItem {
  price: number;
  discount: number;
}

export interface WholesaleItem {
  quantity?: number;
  price: number;
  discount: number;
}

export interface OrderWholesale {
  _id: string;
  type: string;
  label: string;
  item: WholesaleItem;
}

export interface OrderVariant {
  _id: string;
  label: string;
  price: number;
  discount: number;
  unit: string;
}

export interface OrderItem {
  product: OrderProduct;
  supplier: OrderSupplier;
  variant: OrderVariant | null;
  wholesale: OrderWholesale | null;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  _id: string;
  orderUniqueId: string;
  userId: OrderUser;
  orderType: string;
  paymentType: string;
  paymentStatus: string;
  orderStatus: string;
  totalPrice: number;
  transactionId?: string;
  billingInfo: BillingInfo;
  purchaseDate: string;
  items: OrderItem[];
}

export interface OrderAnalytics {
  totalOrder: number;
  totalPendingOrder: number;
  totalDeliveredOrder: number;
  totalSalesAmount: number;
}

export interface OrderMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Order[];
  analytics?: OrderAnalytics;
  meta?: OrderMeta;
}