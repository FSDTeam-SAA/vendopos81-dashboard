import { useQuery } from "@tanstack/react-query";
import { getAllPaymentSttatment } from "../services/paymentSttatment";

export const useAllSettlements = () => {
  return useQuery({
    queryKey: ["all-settlements",],
    queryFn: () => getAllPaymentSttatment(),
  });
};


