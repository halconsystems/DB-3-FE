// Update user (POST /api/user/updateUser)
export interface UpdateUserRequest {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  cnic: string;
  userType: string | number;
  rfidCardNumber: string;
  lastModifiedBy?: string;
  cardIssueDate: string;
  cardExpiryDate: string;
  cardStatus: number;
}

export const updateUser = async (user: UpdateUserRequest) => {
  const response = await apiClient.post(`/user/updateUser`, user);
  return response.data;
};
import apiClient from "../lib/apiClient";
import { parsePagedListData, type PagedList } from "../lib/unwrapApiList";

/** Large page for dropdowns (host user pick) when only the list API exists. */
export const EXTERNAL_USERS_SELECT_PAGE_SIZE = 500;

export interface ExternalUser {
  externalUserName: string;
  id: string;
  ser?: number;
  name: string;
  profilePicture?: string;
  email: string;
  phoneNumber: string;
  cnic: string;
  userType: string | number;
  rfidCardNumber: string;
  cardIssueDate: string;
  cardExpiryDate: string;
  cardStatus: number;
  address?: string | null;
  memberNo?: string | null;
  staffNo?: string | null;
  category?: string | null;
  subCategory?: string | null;
  created: string;
  createdBy: string;
  isDeleted: boolean;
  isActive: boolean;
  lastModified: string | null;
  lastModifiedBy: string | null;
}

export interface AuthUserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  vehicleId: string | null;
  cnic: string;
  profilePicture: string;
  cnicFrontImageUrl: string;
  cnicBackImageUrl: string;
  userRole: string | null;
  isActive: boolean;
  createdAt: string;
}
export const getAllExternalUsers = async (
  params?: { pageNumber?: number; pageSize?: number }
): Promise<PagedList<ExternalUser>> => {
  const pageNumber = params?.pageNumber ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const response = await apiClient.get("/user/GetAllUser", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return parsePagedListData<ExternalUser>(response.data?.data);
};

/** Club members list: same endpoint with fixed category and tab-specific subcategory. */
export const getClubMemberUsers = async (
  subCategory: string,
  params?: { pageNumber?: number; pageSize?: number }
): Promise<PagedList<ExternalUser>> => {
  const pageNumber = params?.pageNumber ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const response = await apiClient.get("/user/GetAllUser", {
    params: {
      Category: "Member",
      SubCategory: subCategory,
      PageNumber: pageNumber,
      PageSize: pageSize,
    },
  });
  return parsePagedListData<ExternalUser>(response.data?.data);
};
export const removeUser = async (id: string) => {
  const response = await apiClient.post(`/user/removeUser`, null, { params: { id } });
  return response.data;
};
export const getUserById = async (id: string): Promise<ExternalUser> => {
  const response = await apiClient.get(`/user/GetUserById`, { params: { Id: String(id) } });
  return response.data.data;
};

export const getAuthUserProfileById = async (id: string): Promise<AuthUserProfile> => {
  const response = await apiClient.get(`/auth/GetUserById`, { params: { Id: String(id) } });
  return response.data.data;
};
export interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  cnic: string;
  userType: string | number;
  rfidCardNumber: string;
  createdBy?: string;
  cardIssueDate: string;
  cardExpiryDate: string;
  cardStatus: number;
}

export const createUser = async (user: CreateUserRequest) => {
  const response = await apiClient.post(`/user/createUser`, user);
  return response.data;
};
