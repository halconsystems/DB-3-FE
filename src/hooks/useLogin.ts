
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { LoginRequest, LoginResponse } from "../types/auth.types";
// import { toast, toastOptions } from "../components/ui/toast";

export const useLogin = () => {
  return useMutation<LoginResponse, any, LoginRequest>({
    mutationFn: login,
  });
};
