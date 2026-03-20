import { useQuery } from "@tanstack/react-query";
import { getLuggageById } from "../../services/luggage.service";

export const useLuggageById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["luggage", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Luggage id is required");
      }
      return getLuggageById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
