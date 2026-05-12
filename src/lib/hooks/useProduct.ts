// src/lib/hooks/useProduct.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  getAllProducts,
  getFilterProducts,
  getSingleProduct,
  updateProduct,
  updateProductStatus,
} from '../services/productService';
import { ProductParams } from '../types/product';
import { toast } from 'sonner';

// Get All Products
export const useAllProducts = (params?: ProductParams) => {
  return useQuery({
    queryKey: ['all-products', params],
    queryFn: () => getAllProducts(params),
  });
};

export const useSingleProduct = (id: string) => {
  return useQuery({
    queryKey: ['single-product', id],
    queryFn: () => getSingleProduct(id),
  });
};

// Get Filter Products
export const useFilterProducts = () => {
  return useQuery({
    queryKey: ['filter-products'],
    queryFn: () => getFilterProducts(),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; formData: FormData }) => updateProduct(data.id, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-products'] });
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateProductStatus(id, status),

    onSuccess: () => {
      toast.success('Product status updated successfully');

      queryClient.invalidateQueries({ queryKey: ['all-products'] });
    },

    onError: () => {
      toast.error('Failed to update product status');
    },
  });
};
