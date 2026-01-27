export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isSuspended: boolean;
    createdAt: string;
    totalOrder: number;
    totalSpent: number;
}

export interface Analytics {
    _id: string | null;
    totalCustomer: number;
    totalActive: number;
    totalSuspended: number;
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: User[];
    analytics: Analytics;
    meta: Meta;
}