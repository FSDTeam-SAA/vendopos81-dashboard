import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, userService } from "../services/userService";
import { toast } from "sonner";


export const useAllUsers = (params?: {
  page?: number;
  limit?: number;
  isSuspended?: boolean | string;
}) => {
  return useQuery({
    queryKey: ["all-users", params],
    queryFn: () => getAllUsers(params),
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userService.suspendUser(userId),
    onSuccess: (data) => {
      toast.success(data?.message || "Supplier suspended successfully");
      queryClient.invalidateQueries({ queryKey: ["all-suppliers"] });
    },
    onError: (error) => {
      toast.error(error?.message || error?.message || "Failed to suspend");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (data) => {
      toast.success(data?.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: (error) => {
      toast.error(error?.message || error?.message || "Failed to delete user");
    },
  });
};