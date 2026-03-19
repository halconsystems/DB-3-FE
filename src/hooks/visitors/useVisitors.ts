import { useQuery } from "@tanstack/react-query";
import { getAllExternalVisitorPass } from "../../services/visitor.service";

export const useVisitors = () => {
  return useQuery({
    queryKey: ["visitors"],
    queryFn: getAllExternalVisitorPass,
    staleTime: 5 * 60 * 1000,
  });
};
