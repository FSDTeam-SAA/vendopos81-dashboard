// src/lib/hooks/useCategory.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createRegionWithCategories,
  // createCategory,
  getAllCategories,
  getAllRegions,
  updateCategory,
} from '../services/categoryService';
import {
  CategoryParams,
  CategoryResponse,
  // CreateCategoryPayload,
  CreateCategoryResponse,
  CreateRegionPayload,
} from '../types/category';

// Get All Categories
export const useAllCategories = (params?: CategoryParams) => {
  return useQuery<CategoryResponse>({
    queryKey: ['all-categories', params],
    queryFn: () => getAllCategories(params),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCategoryResponse, Error, CreateRegionPayload>({
    mutationFn: createRegionWithCategories,
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ['all-categories'] });
      // Notify user
      toast.success('Category created successfully');
    },
    onError: (error: unknown) => {
      console.error('Failed to create region with categories:', error);
      let msg = 'Failed to create category';
      if (error && typeof error === 'object' && 'response' in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = error as any;
        msg = e?.response?.data?.message || e?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast.error(msg);
    },
  });
};
// Update Category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      // If formData is provided, use it directly
      // Narrow data to object
      if (!data || typeof data !== 'object') throw new Error('Invalid update payload');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;

      if (d.formData) {
        return await updateCategory(d);
      }

      // Otherwise, create formData from the data object
      const formData = new FormData();
      if (d.region) formData.append('region', d.region);
      if (d.regionImage instanceof File) formData.append('regionImage', d.regionImage);

      d.categories?.forEach((cat: unknown, index: number) => {
        if (!cat || typeof cat !== 'object') return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cat as any;
        formData.append(`categories[${index}][productType]`, c.productType);
        c.productName?.forEach((name: string, nameIndex: number) => {
          formData.append(`categories[${index}][productName][${nameIndex}]`, name);
        });
        if (c.productImage instanceof File) {
          formData.append(`categories[${index}][productTypeImage]`, c.productImage);
        }
      });

      return await updateCategory({
        _id: d._id,
        ...d,
        formData,
      });
    },
    onSuccess: () => {
      // Invalidate the queries that list regions/categories so UI refreshes
      queryClient.invalidateQueries({ queryKey: ['all-categories'] });
      queryClient.invalidateQueries({ queryKey: ['all-regions'] });
      // keep a broad fallback in case other parts use 'categories'
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // Notify user
      toast.success('Category updated successfully');
    },
    onError: (error: unknown) => {
      console.error('Failed to update category:', error);
      let msg = 'Failed to update category';
      if (error && typeof error === 'object' && 'response' in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = error as any;
        msg = e?.response?.data?.message || e?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast.error(msg);
    },
  });
};

export const useGetAllRegions = () => {
  return useQuery({
    queryKey: ['all-regions'],
    queryFn: () => getAllRegions(),
  });
};
