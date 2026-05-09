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
  parentUserName?: string | null;
  hierarchicalId?: string | null;
  category?: string | null;
  subCategory?: string | null;
  cardStatus?: string | null;
}
