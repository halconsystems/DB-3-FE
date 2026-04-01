import { useQuery } from "@tanstack/react-query";
import { getAllExternalUsers } from "services/user.service";

export const useExternalUsers = () => {
  return useQuery({
    queryKey: ["external-users"],
    queryFn: getAllExternalUsers,
  });
};
