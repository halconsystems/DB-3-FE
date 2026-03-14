import { useMutation } from "@tanstack/react-query";
import { createZone, CreateZoneRequest, CreateZoneResponse } from "../services/zone.service";

export const useCreateZone = () => {
  return useMutation<CreateZoneResponse, any, { data: CreateZoneRequest; token: string }>({
    mutationFn: async ({ data, token }) => createZone(data, token),
  });
};
