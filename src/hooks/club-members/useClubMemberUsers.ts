import { useQuery } from "@tanstack/react-query";
import { getClubMemberUsers } from "services/user.service";

export const useClubMemberUsers = (
  subCategory: string,
  pageNumber: number = 1,
  pageSize: number = 10
) => {
  const trimmed = subCategory?.trim() ?? "";
  return useQuery({
    queryKey: ["club-member-users", trimmed, pageNumber, pageSize],
    queryFn: () => getClubMemberUsers(trimmed, { pageNumber, pageSize }),
    enabled: trimmed.length > 0,
  });
};
