import { useQuery } from "@tanstack/react-query";
import { getAllExternalVisitorPass } from "../../services/visitor.service";

export const useVisitors = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["visitors", pageNumber, pageSize],
    queryFn: () => getAllExternalVisitorPass({ pageNumber, pageSize }),
    staleTime: 5 * 60 * 1000,
  });
};
