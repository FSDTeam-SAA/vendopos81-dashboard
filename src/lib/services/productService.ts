// src/lib/services/productService.ts

import axiosInstance from "../instance/axios-instance";

import { ProductParams } from "../types/product";

// Get All Products
export const getAllProducts = async (params?: ProductParams) => {
  try {
    const response = await axiosInstance.get("/product/all-admin", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get Filter Products
export const getFilterProducts = async () => {
  try {
    const response = await axiosInstance.get("/product/filter");
    return response.data;
  } catch (error) {
    console.error("Error fetching products filter:", error);
    throw error;
  }
};
