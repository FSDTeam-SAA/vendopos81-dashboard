// src/lib/hooks/useCategory.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRegionWithCategories,
  // createCategory,
  getAllCategories,
  getAllRegions,
  updateCategory,
} from "../services/categoryService";
import {
  CategoryParams,
  CategoryResponse,
  // CreateCategoryPayload,
  CreateCategoryResponse,
  CreateRegionPayload,
  UpdateCategoryPayload,
} from "../types/category";

// Get All Categories
export const useAllCategories = (params?: CategoryParams) => {
  return useQuery<CategoryResponse>({
    queryKey: ["all-categories", params],
    queryFn: () => getAllCategories(params),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCategoryResponse, Error, CreateRegionPayload>({
    mutationFn: createRegionWithCategories,
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
    },
    onError: (error) => {
      console.error("Failed to create region with categories:", error);
    },
  });
};
// Update Category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCategoryResponse, Error, UpdateCategoryPayload>({
    mutationFn: updateCategory,
    onSuccess: () => {
      // Refetch categories list after update
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
    },
  });
};

export const useGetAllRegions = () => {
  return useQuery({
    queryKey: ["all-regions"],
    queryFn: () => getAllRegions(),
  });
};
