// src/lib/hooks/useCategory.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  getAllCategories,
  getAllRegions,
  updateCategory,
} from "../services/categoryService";
import {
  CategoryParams,
  CategoryResponse,
  CreateCategoryPayload,
  CreateCategoryResponse,
  UpdateCategoryPayload,
} from "../types/category";

// Get All Categories
export const useAllCategories = (params?: CategoryParams) => {
  return useQuery<CategoryResponse>({
    queryKey: ["all-categories", params],
    queryFn: () => getAllCategories(params),
  });
};

// Create Category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCategoryResponse, Error, CreateCategoryPayload>({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
    },
  });
};

// Update Category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCategoryResponse, Error, UpdateCategoryPayload>({
    mutationFn: updateCategory,
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
    },
  });
};

export const useGetAllRegions = () => {
  return useQuery({
    queryKey: ["all-regions"],
    queryFn: () => getAllRegions(),
  });
};
