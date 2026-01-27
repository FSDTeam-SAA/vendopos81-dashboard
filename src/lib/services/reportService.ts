import axiosInstance from "../instance/axios-instance";


export async function getReportTopBuyers() {
   try{
    const res= await axiosInstance.get(`/reports/top-buyers`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}

export async function getReportTopBuyersSingle(id: string) {
   try{
    const res= await axiosInstance.get(`/reports/${id}`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}