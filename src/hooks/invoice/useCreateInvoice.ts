import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice, CreateInvoicePayload, RemoveInvoiceResponse } from "../../services/invoice.service";

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation<RemoveInvoiceResponse, Error, CreateInvoicePayload>({
    mutationFn: (payload) => createInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
