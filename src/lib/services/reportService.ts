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


// top supplier 
export async function getReportTopSuppliers() {
   try{
    const res= await axiosInstance.get(`/reports/top-suppliers`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}

export async function getReportTopSuppliersSingle(id: string) {
   try{
    const res= await axiosInstance.get(`/join-as-supplier/${id}`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}



// bestSellingProduct 

export async function getReportBestSellingProduct() {
   try{
    const res= await axiosInstance.get(`/reports/top-products`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}   

export async function getReportBestSellingProductSingle(id: string) {   
    try{  
        const res= await axiosInstance.get(`/product/${id}`);      
        return res.data;
       }catch(error){
        if(error instanceof Error){
            throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
        }
       } 
        
    }   
       