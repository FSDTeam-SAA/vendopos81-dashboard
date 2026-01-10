// src/lib/hooks/useUserProfile.ts

import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "@/lib/types/user";
import { userService } from "../services/userService";

export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async ({ signal }) => {
      return userService.getMyProfile(signal);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
