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

export async function getAllInvoices(): Promise<GetAllInvoicesResponse> {
	const response = await apiClient.get("/invoices/GetAllInvoices");
	return response.data;
}

export async function removeInvoice(id: string): Promise<RemoveInvoiceResponse> {
	const response = await apiClient.post("/invoices/removeInvoice", { id });
	return response.data;
}
export interface CreateInvoicePayload {
	invoiceNumber: string;
	tagId: string;
	entityType: string;
	entityId: string;
	amount: number;
	taxAmount: number;
	totalAmount: number;
	createdBy: string;
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<RemoveInvoiceResponse> {
	const response = await apiClient.post("/invoices/createInvoice", payload);
	return response.data;
}
export interface UpdateInvoicePayload {
	id: string;
	status: string;
	paymentMethod: string;
	transactionId: string;
	invoiceNumber: string;
	tagId: string;
	entityType: string;
	lastModifiedBy: string;
	entityId: string;
	amount: number;
	taxAmount: number;
	totalAmount: number;
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
