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

export const getSingleProduct = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
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

export const createProduct = async (data: FormData) => {
  const response = await axiosInstance.post("/product/create-product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id: string, data: FormData) => {
  const response = await axiosInstance.put(
    `/product/update-product/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
