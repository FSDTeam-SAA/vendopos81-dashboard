

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