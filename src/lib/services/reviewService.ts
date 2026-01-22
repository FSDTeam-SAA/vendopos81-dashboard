import axiosInstance from "../instance/axios-instance";

// Get All Suppliers
interface ReviewParams {
  // Define the expected properties of params here
  [key: string]: string | number | boolean | undefined; // Example of a flexible structure
}

export const getAllReviews = async (params?: ReviewParams) => {
  try {
    const response = await axiosInstance.get("/review/all", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const updateReviewStatus = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.put(`/review/update/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating review status:", error);
    throw error;
  }
};
