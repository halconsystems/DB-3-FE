import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth.service";
import { RegisterRequest, RegisterResponse } from "../types/auth.types";
export const useRegister = () => {
  return useMutation<RegisterResponse, any, RegisterRequest>({
    mutationFn: register,
    onSuccess: (data) => {
      console.log('Register API response:', data);
  
    },
    onError: (error: any) => {
      console.error('Register API error:', error);
      if (error?.response) {
        console.error('API error response:', error.response);
      }
  
    },
  });
};