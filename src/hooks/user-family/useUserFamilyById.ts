import { useQuery } from "@tanstack/react-query";
import { getUserFamilyById, UserFamily } from "../../services/user-family.service";

export const useUserFamilyById = (id: string, enabled = true) => {
  return useQuery<UserFamily>({
    queryKey: ["userFamily", id],
    queryFn: () => getUserFamilyById(id),
    enabled: !!id && enabled,
  });
};
