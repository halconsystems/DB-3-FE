export interface TagApprovalRequest {
  id: string;
  entityName: string;
  entityId: string;
  tagTypeId: string;
  tagNumber: string;
  feeScaleId: string;
  planType: number;
  validFrom: string;
  validTo: string;
  zoneId: string | null;
  deviceId: string | null;
  notes: string;
  status: number;
}

export interface GetTagApprovalRequestsResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: TagApprovalRequest[];
}
