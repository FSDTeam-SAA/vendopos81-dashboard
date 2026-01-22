import axiosInstance from "../instance/axios-instance";

// Get All Suppliers
interface OrdersParams {
  // Define the expected properties of params here
  [key: string]: string | number | boolean | undefined; // Example of a flexible structure
}

export const getAllOrders = async (params?:OrdersParams ) => {
  try {
    const response = await axiosInstance.get("/order/all-orders", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
