import apiClient from "../lib/apiClient";
export interface InvoiceRecord {
	id: string;
	invoiceNumber: string;
	tagId: string;
	entityType: string;
	entityId: string;
	amount: number;
	taxAmount: number;
	totalAmount: number;
	status: string;
	paidAt: string | null;
	paymentMethod: string | null;
	transactionId: string | null;
	trialPeriodDays: number;
	trialDueAtUtc: string;
	trialExtensionReason: string | null;
}

export interface GetAllInvoicesResponse {
	statusCode: number;
	successMessage: string;
	errorMessage: string | null;
	data: InvoiceRecord[];
}

export interface RemoveInvoiceResponse {
	statusCode: number;
	successMessage: string;
	errorMessage: string | null;
}


export interface GetAllInvoicesPayload {
	pageNumber: number;
	pageSize: number;
	invoiceNumber?: string;
	fromDate?: string;
	toDate?: string;
}

export async function getAllInvoices(payload: GetAllInvoicesPayload): Promise<GetAllInvoicesResponse> {
	// Only send pageNumber and pageSize in the payload
	const fullPayload = {
		pageNumber: payload.pageNumber ?? 1,
		pageSize: payload.pageSize ?? 10,
	};
	const response = await apiClient.post("/invoices/GetAllInvoices", fullPayload);
	
	const apiData = response.data;
	// If the API returns nested data, flatten it to match the expected response
	if (apiData && apiData.data && apiData.data.data && Array.isArray(apiData.data.data.items)) {
		return {
			...apiData,
			data: apiData.data.data.items,
		};
	}
	return apiData;
}

export async function removeInvoice(id: string): Promise<RemoveInvoiceResponse> {
	const response = await apiClient.post("/invoices/removeInvoice", { id });
	return response.data;
}
export interface CreateInvoicePayload {
	id: string;
	paymentMethod: string;
	transactionId: string;
	invoiceNumber: string;
	tagId: string;
	entityType: string;
	entityId?: string;
	amount?: number;
	taxAmount?: number;
	totalAmount?: number;
	createdBy?: string;
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<RemoveInvoiceResponse> {
	const response = await apiClient.post("/invoices/createInvoice", payload);
	return response.data;
}
export interface UpdateInvoicePayload {
	id: string;
	paymentMethod: string;
	invoiceNumber: string;
	tagId: string;
	entityType: string;
	entityId?: string;
	transactionId?: string;
	status?: string;
	lastModifiedBy?: string;
	amount?: number;
	taxAmount?: number;
	totalAmount?: number;
}

export async function updateInvoice(payload: UpdateInvoicePayload): Promise<RemoveInvoiceResponse> {
	const response = await apiClient.post("/invoices/updateInvoice", payload);
	return response.data;
}
export interface GetInvoiceByIdResponse {
	statusCode: number;
	successMessage: string;
	errorMessage: string | null;
	data: InvoiceRecord;
}

export async function getInvoiceById(id: string): Promise<GetInvoiceByIdResponse> {
	const response = await apiClient.get(`/invoices/${id}`);
	return response.data;
}
