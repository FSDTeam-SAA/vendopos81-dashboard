"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


import { useEffect } from "react"
import { toast } from "sonner"

import { useSession } from "next-auth/react"
import { useQueryClient } from "@tanstack/react-query"
import { useGetProfile, useUpdateProfile } from "@/lib/hooks/useProfile"
import { PersonalInformationFormData, personalInformationSchema } from "../securitycontainer/schema"
import PersonalInformationPresenter from "./PersonalInformationPresenter"

const PersonalInformationContainer = ({ onSetEdit }: { onSetEdit: (v: boolean) => void }) => {
  const { data } = useGetProfile()
  const { data: session } = useSession()
  const { mutate, isPending } = useUpdateProfile();
  const queryclient = useQueryClient()

  const profile = data?.data || session?.user
  
  const form = useForm<PersonalInformationFormData>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? "",
      street: profile?.street ?? "",
      location: profile?.location ?? "",
      postalCode: profile?.postalCode ?? "",
    },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        street: profile.street ?? "",
        location: profile.location ?? "",
        postalCode: profile.postalCode ?? "",
      })
    }
  }, [profile, form])

  const onSubmit = (data: PersonalInformationFormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phone", data.phone);
    if (data.location) formData.append("location", data.location);
    if (data.street) formData.append("street", data.street);
    if (data.postalCode) formData.append("postalCode", data.postalCode);

    if (data.image) {
      formData.append("image", data.image);
    }
    
    mutate(formData, {
      onSuccess: () => {
        toast.success("Success", {
          description: "Your profile has been updated successfully.",
        })
        queryclient.invalidateQueries({
          queryKey: ['profile']
        })
        onSetEdit(false)
      },
      onError: () => {
        toast.error("Error", {
          description: "Failed to update profile. Please try again.",
        })
      }
    })
  }

  return <PersonalInformationPresenter form={form} onSubmit={onSubmit} isLoading={isPending} profile={profile} />
}


export default PersonalInformationContainer
