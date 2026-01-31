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

  /**
   * Suspend a supplier/user
   */
  async suspendUser(userId: string){
    const response = await axiosInstance.put(`${this.baseUrl}/suspend-supplier/${userId}`);
    return response.data;
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string) {
    const response = await axiosInstance.delete(`${this.baseUrl}/delete/${userId}`);
    return response.data;
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