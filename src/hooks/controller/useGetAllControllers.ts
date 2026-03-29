import { useQuery } from "@tanstack/react-query";
import { getAllControllers } from "../../services/controllers.service";

export const useGetAllControllers = () => {
  return useQuery({
    queryKey: ["controllers-all"],
    queryFn: getAllControllers,
  });
};
