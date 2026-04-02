import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInvoice, UpdateInvoicePayload, RemoveInvoiceResponse } from "../../services/invoice.service";

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation<RemoveInvoiceResponse, Error, UpdateInvoicePayload>({
    mutationFn: (payload) => updateInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
