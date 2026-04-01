export interface FeeScale {
  id: string;
  name: string;
  feeCategory: string;
  amount: number;
  description: string;
  applicableUserTypes: string;
  applicableVehicleCategory: string;
  isTaxApplicable: boolean;
  taxPercentage: number;
  currency: string;
  created: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  isDeleted: boolean;
  isActive: boolean;
}

export interface GetAllFeeScaleResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string;
  data: FeeScale[];
}
