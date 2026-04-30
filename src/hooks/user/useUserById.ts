import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../services/user.service";

export const useUserById = (id: string | undefined) => {
  const userId = id ? String(id) : undefined;

  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => (userId ? getUserById(userId) : Promise.reject("No ID provided")),
    enabled: !!userId,
  });
};
