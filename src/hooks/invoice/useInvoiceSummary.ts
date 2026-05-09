import { useQuery } from "@tanstack/react-query";
import {
	getInvoiceSummary,
	type GetInvoiceSummaryParams,
	type InvoiceSummaryTotals,
} from "../../services/invoice.service";

export function useInvoiceSummary(params: GetInvoiceSummaryParams) {
	return useQuery<InvoiceSummaryTotals>({
		queryKey: [
			"invoice-summary",
			params.pageNumber ?? 1,
			params.pageSize ?? 5,
			params.fromDate ?? "",
			params.toDate ?? "",
		],
		queryFn: () => getInvoiceSummary(params),
	});
}
