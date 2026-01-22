import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllReviews, updateReviewStatus } from "../services/reviewService";

export interface ReviewParams {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export const useAllReviews = (params?: ReviewParams) => {
  return useQuery({
    queryKey: ["all-review", params],
    queryFn: () => getAllReviews(params),
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-review"] });
    },
  });
};
