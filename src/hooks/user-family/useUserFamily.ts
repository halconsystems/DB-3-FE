import { useQuery } from "@tanstack/react-query";
import { getAllUserFamily } from "../../services/user-family.service";
import type { PagedList } from "../../lib/unwrapApiList";
import type { UserFamily } from "../../services/user-family.service";

export const useUserFamily = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery<PagedList<UserFamily>>({
    queryKey: ["userFamilyList", pageNumber, pageSize],
    queryFn: () => getAllUserFamily({ pageNumber, pageSize }),
  });
};
