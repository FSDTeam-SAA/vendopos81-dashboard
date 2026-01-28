import BestSellingProduct from "@/components/Dashboard/reports/bestSelling/BestSellingProduct";


export interface TopBuyer {
    _id: string;
    firstName: string;
    lastName: string;
    totalOrder: number;
    totalSpent: number;
}

export interface TopBuyersApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: TopBuyer[];
}
export interface RecentOrder {
    orderUniqueId: string;
    totalPrice: number;
    paymentStatus: string;
    orderStatus: string;
    purchaseDate: string;
}

export interface BuyerDetail {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    totalOrder: number;
    totalSpent: number;
    recentOrders: RecentOrder[];
}

export interface BuyerDetailApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: BuyerDetail;
}


export interface TopSupplier {
  id: string;
  shopName: string;
  brandName: string;
  logo: string;
  totalOrders: number;
  totalValue: number;
  rating: number;
}

export interface GetTopSuppliersResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: TopSupplier[];
}



// BestSellingProduct

export interface BestsellingProduct {
  id: string;
  title: string;
  categoryRegion: string | null;
  totalSold: number;
  rating: number;
}

export interface GetBestsellingProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: BestsellingProduct[];
}