// src/lib/services/categoryService.ts

import axiosInstance from "../instance/axios-instance";
import { CategoryParams, CreateCategoryPayload, UpdateCategoryPayload } from "../types/category";

// Get All Categories
export const getAllCategories = async (params?: CategoryParams) => {
  try {
    const response = await axiosInstance.get("/category/get-all", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Create Category
export const createCategory = async (payload: CreateCategoryPayload) => {
  try {
    const formData = new FormData();
    formData.append("region", payload.region);
    formData.append("productType", payload.productType);

    // Append each product name with array notation
    payload.productName.forEach((name, index) => {
      formData.append(`productName[${index}]`, name);
    });

    // Append images if provided
    if (payload.productImage) {
      formData.append("productImage", payload.productImage);
    }
    if (payload.regionImage) {
      formData.append("regionImage", payload.regionImage);
    }

    const response = await axiosInstance.post("/category/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Update Category
export const updateCategory = async (payload: UpdateCategoryPayload) => {
  try {
    const formData = new FormData();
    formData.append("region", payload.region);
    formData.append("productType", payload.productType);

    // Append each product name with array notation
    payload.productName.forEach((name, index) => {
      formData.append(`productName[${index}]`, name);
    });

    // Append images if provided
    if (payload.productImage) {
      formData.append("productImage", payload.productImage);
    }
    if (payload.regionImage) {
      formData.append("regionImage", payload.regionImage);
    }

    const response = await axiosInstance.put(
      `/category/update/${payload._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
