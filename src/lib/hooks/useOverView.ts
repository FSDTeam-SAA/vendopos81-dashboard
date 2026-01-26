import {  useQuery } from "@tanstack/react-query";
import {  getAnalytics, getUserProfileRevenue, getUserProfileSalesByRegion } from "../services/OverViewService";

export function useOverviewRevenue() {
    return useQuery({
    queryKey :['profile'],
    queryFn:()=> getUserProfileRevenue()
    })
    
}


export function useOverviewSalesByRegion() {
    return useQuery({
        queryKey: ['sales-by-region'],
        queryFn: () => getUserProfileSalesByRegion()
    })
}

export  function useAnalytics() {
    return useQuery({
        queryKey: ['overview-data'],
        queryFn: () => getAnalytics(),
    })
}