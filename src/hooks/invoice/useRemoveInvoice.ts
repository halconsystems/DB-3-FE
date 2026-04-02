import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeInvoice } from "../../services/invoice.service";
import type { RemoveInvoiceResponse } from "../../services/invoice.service";

export function useRemoveInvoice() {
  const queryClient = useQueryClient();

  return useMutation<RemoveInvoiceResponse, Error, { id: string }>({
    mutationFn: ({ id }) => removeInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
