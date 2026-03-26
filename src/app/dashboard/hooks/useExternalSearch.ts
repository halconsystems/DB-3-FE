import { useMutation } from "@tanstack/react-query";
import { externalSearch, ExternalSearchRequest, ExternalSearchResponse } from "../../../services/dashboard.service";

export function useExternalSearch() {
  return useMutation<ExternalSearchResponse, unknown, ExternalSearchRequest>({
    mutationFn: externalSearch
  });
}
