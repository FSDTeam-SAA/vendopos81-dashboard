import axiosInstance from "../instance/axios-instance";


export async function getUserProfileRevenue() {
   try{
    const res= await axiosInstance.get(`/dashboard/revenue-charts?type=revenue&year=2025`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}

export async function getAnalytics() {
   try{
    const res= await axiosInstance.get(`/dashboard/analytics`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}

export async function getUserProfileSalesByRegion() {
   try{
    const res= await axiosInstance.get(`/dashboard/regional-sales`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}