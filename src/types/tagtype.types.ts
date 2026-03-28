export interface TagType {
  id: string;
  name: string;
  description: string;
  createdBy: string | null;
  created: string;
  lastModified: string | null;
  lastModifiedBy: string | null;
  isDeleted: boolean;
  isActive: boolean | null;
}

export interface GetAllTagTypesResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: TagType[];
}
