import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSingleSuppliers,
  getAllSuppliers,
  updateSupplierStatus,
} from "../services/suppliersService";
import { SupplierResponse } from "../types/supplier";
import { toast } from "sonner";

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

export const useUpdateSupplierStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-supplier-status"],
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateSupplierStatus(id, status),
    onSuccess: (data) => {
      toast.success(data?.message || "Supplier status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-suppliers"] });
    },
    onError: (error) => {
      // console.error("Error updating supplier status:", error);
      toast.error(error?.message || "Failed to update supplier status");
    }
  });
};
