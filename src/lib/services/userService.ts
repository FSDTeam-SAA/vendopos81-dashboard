// src/lib/services/userService.ts

import { UserProfile, UserProfileResponse } from "@/lib/types/user";
import axiosInstance from "../instance/axios-instance";

class UserService {
  private baseUrl = "/user";

  /**
   * Fetch current user's profile
   */
  async getMyProfile(signal?: AbortSignal): Promise<UserProfile> {
    const response = await axiosInstance.get<UserProfileResponse>(
      `${this.baseUrl}/my-profile`,
      { signal },
    );
    return response.data.data;
  }
}

export const userService = new UserService();
