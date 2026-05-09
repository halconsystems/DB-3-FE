import { useQuery } from "@tanstack/react-query";
import { getAllExternalUsers } from "services/user.service";

export const useExternalUsers = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["external-users", pageNumber, pageSize],
    queryFn: () => getAllExternalUsers({ pageNumber, pageSize }),
  });
};
