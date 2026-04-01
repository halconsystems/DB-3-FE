import { useQuery } from "@tanstack/react-query";
import { getAllUserFamily, UserFamily } from "../../services/user-family.service";

export const useUserFamily = () => {
  return useQuery<UserFamily[]>({
    queryKey: ["userFamilyList"],
    queryFn: getAllUserFamily,
  });
};
