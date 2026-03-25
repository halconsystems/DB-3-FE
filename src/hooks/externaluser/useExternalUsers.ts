import { useQuery } from "@tanstack/react-query";
import { getAllExternalUsers } from "services/externalUser.service";

export const useExternalUsers = () => {
  return useQuery({
    queryKey: ["external-users"],
    queryFn: getAllExternalUsers,
  });
};
