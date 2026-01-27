import { axiosInstance } from "../instance/axios-instance";

export interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Subscriber[];
  meta: SubscriptionMeta;
}

export const subscriptionService = {
  getAll: async (page = 1, limit = 10): Promise<SubscriptionResponse> => {
    const response = await axiosInstance.get(
      `/subscription/get-all-subscription?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
