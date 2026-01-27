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


// fetch all users
export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  isSuspended?: boolean | string;
}) {
  try {
    const response = await axiosInstance.get('/user/all-users', {
      params,
    });
    return response.data;
  } catch (error) {
    // console.error("Error fetching all users:", error);
    throw error;
  }
}