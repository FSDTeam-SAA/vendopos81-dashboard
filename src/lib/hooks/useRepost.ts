import { useQuery } from "@tanstack/react-query";
import { getReportTopBuyers, getReportTopBuyersSingle } from "../services/reportService";



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

