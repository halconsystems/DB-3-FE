import { useQuery } from "@tanstack/react-query";
import { getTagById } from "../../services/tag.service";
import type { GetTagByIdResponse } from "../../services/tag.service";
export const useGetTagById = (id: string | undefined, enabled: boolean = true) => {
  return useQuery<GetTagByIdResponse, Error>({
    queryKey: ["tag", id],
    queryFn: () => getTagById(id as string),
    enabled: !!id && enabled,
  });
};