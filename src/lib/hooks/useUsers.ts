import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/userService";


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