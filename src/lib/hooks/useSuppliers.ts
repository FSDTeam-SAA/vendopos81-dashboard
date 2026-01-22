import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSingleSuppliers, getAllSuppliers } from "../services/suppliersService";
import { SupplierResponse } from "../types/supplier";

// Get All Suppliers
export interface SupplierParams {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export const useAllSuppliers = (params?: SupplierParams) => {
  return useQuery<SupplierResponse>({
    queryKey: ["all-suppliers", params],
    queryFn: () => getAllSuppliers(params),
  });
};

export const useDeleteSingleSuppliers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-supplier"],
    mutationFn: (id: string) => deleteSingleSuppliers(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-suppliers"] });
    },
  });
};
