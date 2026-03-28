export interface Tag {
  id: string;
  tagNumber: string;
  tagTypeId: string;
  status: number;
  validFrom: string;
  validTo: string;
  assignedEntityType: string;
  assignedEntityId: string;
  created: string;
  lastModified: string;
  createdBy: string | null;
  lastModifiedBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface GetAllTagsResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: Tag[];
}
