import { useQuery } from "@tanstack/react-query";

import { getAllInvoices } from "../../services/invoice.service";
import type { GetAllInvoicesResponse, GetAllInvoicesPayload } from "../../services/invoice.service";

export function useInvoices(payload: GetAllInvoicesPayload) {
  return useQuery<GetAllInvoicesResponse>({
    queryKey: ["invoices", payload],
    queryFn: () => getAllInvoices(payload),
  });
}
