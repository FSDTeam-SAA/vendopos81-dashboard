export interface PaymentUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface PaymentOrder {
    _id: string;
    orderStatus: string;
    orderUniqueId: string;
}

export interface Payment {
    _id: string;
    userId: PaymentUser;
    orderId: PaymentOrder;
    amount: number;
    currency: string;
    status: string;
    paymentDate: string;
    createdAt: string;
    updatedAt: string;
    customTransactionId: string;
}

export interface PaymentAnalytics {
    totalRevenue: number;
    completedPayment: number;
    pendingPayment: number;
    failedPayment: number;
}

export interface PaymentMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface PaymentApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: Payment[];
    analytics: PaymentAnalytics;
    meta: PaymentMeta;
}

export interface PaymentParams {
    status?: string;
    page?: number;
    limit?: number;
    [key: string]: string | number | undefined;
}
