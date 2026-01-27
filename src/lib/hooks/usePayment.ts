import { useQuery } from "@tanstack/react-query";
import { getAllPayments } from "../services/paymentService";
import { PaymentParams } from "../types/payment";

export const useAllPayments = (params?: PaymentParams) => {
  return useQuery({
    queryKey: ["all-payments", params],
    queryFn: () => getAllPayments(params),
  });
};
