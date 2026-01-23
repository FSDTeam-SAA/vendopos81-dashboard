import axiosInstance from "../instance/axios-instance";

export async function getUserProfile() {
   try{
    const res= await axiosInstance.get(`/user/my-profile`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}

export async function userProfileUpdate(data:FormData) {
   try{
    const res= await axiosInstance.put(`/user/update-profile`,data);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}


export async function changePassword({currentPassword,newPassword}:{currentPassword:string,newPassword:string}) {
           try{
    const res= await axiosInstance.post(`/auth/change-password`,{currentPassword,newPassword});
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to faild to update Password")
    }
   } 
}