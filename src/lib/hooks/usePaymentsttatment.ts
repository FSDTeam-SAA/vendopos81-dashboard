import { useMutation, useQuery } from '@tanstack/react-query';
import { getAllPaymentSettlements, transferPaymentToSupplier } from '../services/paymentSttatment';

export const useAllSettlements = () => {
  return useQuery({
    queryKey: ['all-settlements'],
    queryFn: () => getAllPaymentSettlements(),
  });
};

export const useTransferPaymentToSupplier = () => {
  return useMutation({
    mutationFn: (settlementId: string) => transferPaymentToSupplier(settlementId),
  });
};
