// src/lib/hooks/useProduct.ts
 

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/productService";


// Get All Products
export const useAllProducts = () => {
    return useQuery({
        queryKey: ['all-products'],
        queryFn: () => getAllProducts(),
    });
};
