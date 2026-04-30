import { useQuery } from "@tanstack/react-query";
import { getAuthUserProfileById } from "../../services/user.service";

export const useAuthUserProfileById = (id: string | undefined) => {
  const userId = id ? String(id) : undefined;

  return useQuery({
    queryKey: ["auth-user-profile", userId],
    queryFn: () => (userId ? getAuthUserProfileById(userId) : Promise.reject("No ID provided")),
    enabled: !!userId,
  });
};
