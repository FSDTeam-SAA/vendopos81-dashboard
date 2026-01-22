
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../services/orderService";

export interface OrdersParams {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export const useAllOrders = (params?: OrdersParams) => {
  return useQuery({
    queryKey: ["all-order", params],
    queryFn: () => getAllOrders(params),
  });
};

// export const useUpdateReviewStatus = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, status }: { id: string; status: string }) =>
//       updateReviewStatus(id, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["all-review"] });
//     },
//   });
// };
