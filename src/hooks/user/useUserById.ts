import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../services/user.service";

export const useUserById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => (id ? getUserById(id) : Promise.reject("No ID provided")),
    enabled: !!id,
  });
};
