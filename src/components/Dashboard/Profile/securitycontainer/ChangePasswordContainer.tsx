"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ChangePasswordPresenter from "./ChangePasswordPresenter";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "./schema";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdatePassword } from "@/lib/hooks/useProfile";


const ChangePasswordContainer = () => {
  const { mutate, isPending } = useUpdatePassword();
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Success", {
            description: "Your password has been changed successfully.",
          });
          form.reset();
        },
        onError: () => {
          toast.error("Error", {
            description: "Failed to change password. Please try again.",
          });
        },
      }
    );
  };

  return (
    <ChangePasswordPresenter
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
    />
  );
};

export default ChangePasswordContainer;
