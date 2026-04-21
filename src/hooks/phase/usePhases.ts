import { useQuery } from "@tanstack/react-query";
import { getAllPhase } from "../../services/phase.service";

export function usePhases() {
  return useQuery({
    queryKey: ["phases"],
    queryFn: async () => {
      const res = await getAllPhase();

      return res.data.map((item) => ({
        id: item.id,
        phaseName: item.phaseName,
        description: item.description,
        status: item.isActive ? "Active" : "Inactive",
      }));
    },
  });
}
