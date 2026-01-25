// src/lib/hooks/useProduct.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, getFilterProducts, createProduct, updateProduct } from "../services/productService";
import { ProductParams } from "../types/product";

// Get All Products
// Get All Products
export const useAllProducts = (params?: ProductParams) => {
  return useQuery({
    queryKey: ["all-products", params],
    queryFn: () => getAllProducts(params),
  });
};

// Get Filter Products
export const useFilterProducts = () => {
  return useQuery({
    queryKey: ["filter-products"],
    queryFn: () => getFilterProducts(),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; formData: FormData }) =>
      updateProduct(data.id, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};
