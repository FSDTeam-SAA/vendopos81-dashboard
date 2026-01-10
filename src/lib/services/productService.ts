// src/lib/services/productService.ts
 
import axiosInstance from "../instance/axios-instance";


// Get All Products
export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/product/all-admin');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};