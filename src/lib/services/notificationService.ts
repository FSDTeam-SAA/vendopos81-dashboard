
import axiosInstance from "../instance/axios-instance";
import { NotificationsParams } from "../types/notification";

// Get All Notifications
export const getAllNotifications = async (id: string, params?: NotificationsParams) => {
  try {
    const response = await axiosInstance.get(`/notification/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark notification as viewed
export const markNotificationAsViewed = async () => {
  try {
    const response = await axiosInstance.patch(`/notification/read/all`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as viewed:", error);
    throw error;
  }
};
