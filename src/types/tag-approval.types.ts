export interface TagApprovalRequest {
  id: string;
  subjectType: string;
  subjectId: string;
  subjectName: string;
  tagType: string;
  tagNumber: string;
  feeScale: string;
  planType: string;
  validFrom: string;
  validTo: string;
  notes: string;
  status: string;
  trialPeriod: string;
}

export interface GetTagApprovalRequestsResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: TagApprovalRequest[];
}
