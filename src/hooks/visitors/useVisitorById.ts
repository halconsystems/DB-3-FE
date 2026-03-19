import { useQuery } from "@tanstack/react-query";
import { getExternalVisitorPassById } from "../../services/visitor.service";

export const useVisitorById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["visitor", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Visitor id is required");
      }
      return getExternalVisitorPassById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
