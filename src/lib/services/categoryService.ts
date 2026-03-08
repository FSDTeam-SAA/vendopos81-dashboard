// src/lib/services/categoryService.ts

import axiosInstance from "../instance/axios-instance";
import {
  CategoryParams,
  CreateRegionPayload,
  UpdateCategoryPayload,
} from "../types/category";

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

export const createRegionWithCategories = async (
  payload: CreateRegionPayload,
) => {
  try {
    const formData = new FormData();

    // Add region info
    formData.append("region", payload.region);

    if (payload.regionImage) {
      formData.append("regionImage", payload.regionImage);
    }

    // Add multiple categories
    payload.categories.forEach((cat, catIndex) => {
      formData.append(`categories[${catIndex}][productType]`, cat.productType);

      // product names array
      cat.productName.forEach((name, nameIndex) => {
        formData.append(
          `categories[${catIndex}][productName][${nameIndex}]`,
          name,
        );
      });

      // category image
      if (cat.productImage) {
        formData.append(
          `categories[${catIndex}][productImage]`,
          cat.productImage,
        );
      }
    });

    const response = await axiosInstance.post("/category/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating region with categories:", error);
    throw error;
  }
};

// Update Category
export const updateCategory = async (payload: UpdateCategoryPayload) => {
  try {
    const formData = new FormData();

    // region info
    formData.append("region", payload.region);

    if (payload.regionImage) {
      formData.append("regionImage", payload.regionImage);
    }

    // categories (multi)
    payload.categories.forEach((cat, catIndex) => {
      formData.append(`categories[${catIndex}][productType]`, cat.productType);

      // product names array
      cat.productName.forEach((name, nameIndex) => {
        formData.append(
          `categories[${catIndex}][productName][${nameIndex}]`,
          name,
        );
      });

      // category image
      if (cat.productImage) {
        formData.append(
          `categories[${catIndex}][productImage]`,
          cat.productImage,
        );
      }
    });

    const response = await axiosInstance.put(
      `/category/update/${payload._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const getAllRegions = async () => {
  try {
    const response = await axiosInstance.get("category/get-region");
    return response.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
};
