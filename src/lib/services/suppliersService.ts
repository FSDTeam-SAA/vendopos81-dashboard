// src/lib/services/suppliersService.ts

import axiosInstance from "../instance/axios-instance";

// Get All Suppliers
interface SupplierParams {
  // Define the expected properties of params here
  [key: string]: string | number | boolean | undefined; // Example of a flexible structure
}

export const getAllSuppliers = async (params?: SupplierParams) => {
  try {
    const response = await axiosInstance.get(
      "/join-as-supplier/all-suppliers",
      { params },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};



export const deleteSingleSuppliers = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `/join-as-supplier/delete-supplier/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error Delete suppliers:", error);
    throw error;
  }
};

export const updateSupplierStatus = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.put(
      `/join-as-supplier/update-status/${id}`,
      { status },
    );
    console.log('respons data',response.data)
    return response.data;
  } catch (error) {
    console.error("Error updating supplier status:", error);
    throw error;
  }
};
