import { useQuery } from "@tanstack/react-query";
import { getReportBestSellingProduct, getReportBestSellingProductSingle, getReportTopBuyers, getReportTopBuyersSingle, getReportTopSuppliers, getReportTopSuppliersSingle } from "../services/reportService";



export function useReportTopBuyers(){
    return useQuery({
        queryKey:['profile'],
        queryFn:()=>getReportTopBuyers()
    })
}



export function useReportTopBuyersSingle(id: string){
    return useQuery({
        queryKey:['profile', id],
        queryFn:()=>getReportTopBuyersSingle(id)
    })
}

// top supplier hooks

export function useReportTopSuppliers(){
    return useQuery({
        queryKey:['top-suppliers'],
        queryFn:()=>getReportTopSuppliers()
    })
}

export function useReportTopSuppliersSingle(id: string){
    return useQuery({
        queryKey:['top-suppliers', id],
        queryFn:()=>getReportTopSuppliersSingle(id)
    })
}


// best selling product hooks

export function useReportBestSellingProduct(){
    return useQuery({
        queryKey:['best-selling-product'],
        queryFn:()=>getReportBestSellingProduct()
    })
}

export function useReportBestSellingProductSingle(id: string){
    return useQuery({
        queryKey:['best-selling-product', id],
        queryFn:()=>getReportBestSellingProductSingle(id)
    })
}
