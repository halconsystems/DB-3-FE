import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth.service";
import { RegisterRequest, RegisterResponse } from "../types/auth.types";
import { toast, toastOptions } from "../components/ui/toast";
export const useRegister = () => {
  return useMutation<RegisterResponse, any, RegisterRequest>({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success(data.successMessage || "Registration successful!", toastOptions);
    },
    onError: (error: any) => {
      const apiMsg = error?.response?.data?.errorMessage || error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
      toast.error(apiMsg, toastOptions);
    },
  });
};