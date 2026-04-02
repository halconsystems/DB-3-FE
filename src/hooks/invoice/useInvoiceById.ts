import { useQuery } from "@tanstack/react-query";
import { getInvoiceById, GetInvoiceByIdResponse } from "../../services/invoice.service";

export function useInvoiceById(id: string, options = {}) {
  return useQuery<GetInvoiceByIdResponse, Error>({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
    ...options,
  });
}
