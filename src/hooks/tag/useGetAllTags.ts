import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "../../services/tag.service";
import { GetAllTagsResponse } from "../../types/tag.types";
export const useGetAllTags = () => {
  return useQuery<GetAllTagsResponse, Error>({
    queryKey: ["tags"],
    queryFn: getAllTags,
  });
};
