import { useMutation, useQuery } from "@tanstack/react-query"
import { changePassword, getUserProfile, userProfileUpdate } from "../services/profileService"

export function useGetProfile(){
    return useQuery({
        queryKey:['profile'],
        queryFn:()=>getUserProfile()
    })
}


export function useUpdateProfile() {
    return useMutation({
    mutationKey :['profile'],
    mutationFn:(data:FormData)=> userProfileUpdate(data)
    })
    
}


export function useUpdatePassword() {
    return useMutation({
    mutationKey :['password'],
    mutationFn:(data:{currentPassword:string,newPassword:string})=> changePassword(data)
    })
    
}