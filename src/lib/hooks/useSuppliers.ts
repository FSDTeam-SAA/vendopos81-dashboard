// src/lib/hooks/useSuppliers.ts

import { useQuery } from "@tanstack/react-query";
import { getAllSuppliers } from "../services/suppliersService";

// Get All Suppliers
export interface SupplierParams {
  // Define the expected properties of params here
  // For example:
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined; // Adjust index signature
}

export const useAllSuppliers = (params?: SupplierParams) => {
  return useQuery<SupplierParams>({
    queryKey: ["all-suppliers", params],
    queryFn: () => getAllSuppliers(params),
  });
};
