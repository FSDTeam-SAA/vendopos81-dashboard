export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Review {
  _id: string;
  userId: ReviewUser;
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewAnalytics {
  totalReview: number;
  totalPendingReview: number;
  averageRating: number;
  thisMonthReviewCount: number;
}

export interface ReviewMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Review[];
  analytics: ReviewAnalytics;
  meta: ReviewMeta;
}