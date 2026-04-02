import { useQuery } from "@tanstack/react-query";
import { getAllInvoices } from "../../services/invoice.service";
import type { GetAllInvoicesResponse } from "../../services/invoice.service";

export function useInvoices() {
  return useQuery<GetAllInvoicesResponse>({
    queryKey: ["invoices"],
    queryFn: getAllInvoices,
  });
}
