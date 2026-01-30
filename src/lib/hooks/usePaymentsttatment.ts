import { useQuery } from "@tanstack/react-query";
import { getAllPaymentSettlements } from "../services/paymentSttatment";

export const useAllSettlements = () => {
  return useQuery({
    queryKey: ["all-settlements",],
    queryFn: () => getAllPaymentSettlements(),
  });
};


