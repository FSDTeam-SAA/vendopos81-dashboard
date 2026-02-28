/* eslint-disable @typescript-eslint/no-explicit-any */
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
    onSuccess: (data) => {
      toast.success(data?.message || "Supplier deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-suppliers"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete supplier",
      );
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
      toast.success(data?.message || "Supplier status updated");

      // real-time update
      queryClient.invalidateQueries({ queryKey: ["all-suppliers"] });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update supplier status",
      );
    },
  });
};