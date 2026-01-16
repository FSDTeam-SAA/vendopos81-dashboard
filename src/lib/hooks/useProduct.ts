// src/lib/hooks/useProduct.ts

import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getFilterProducts } from "../services/productService";
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
