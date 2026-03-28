import { useQuery } from "@tanstack/react-query";
import { getTagTypeById } from "../../services/tagtype.service";
import { TagType } from "../../types/tagtype.types";

export const useGetTagTypeById = (id: string) => {
  return useQuery<TagType, Error>({
    queryKey: ["tagtype", id],
    queryFn: () => getTagTypeById(id),
    enabled: !!id,
  });
};
