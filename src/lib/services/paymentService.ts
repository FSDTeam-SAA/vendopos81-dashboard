import axiosInstance from "../instance/axios-instance";
import { PaymentApiResponse, PaymentParams } from "../types/payment";

export const getAllPayments = async (params?: PaymentParams): Promise<PaymentApiResponse> => {
  try {
    const response = await axiosInstance.get("/payment/get-all", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};
