import { useQuery } from "@tanstack/react-query";
import { getAllTagTypes } from "../../services/tagtype.service";
import { GetAllTagTypesResponse } from "../../types/tagtype.types";

export const useGetAllTagTypes = () => {
  return useQuery<GetAllTagTypesResponse, Error>({
    queryKey: ["tagtypes"],
    queryFn: getAllTagTypes,
  });
};
