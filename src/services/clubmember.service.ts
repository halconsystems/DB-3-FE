import apiClient from "../lib/apiClient";

export interface ClubMemberApiResponse {
  ser: number;
  profileImage: string;
  username: string;
  email: string;
  phone: string;
  cnic: string;
  subCategory: string;
  memberNo: string;
  address: string | null;
  cardNumber: string | null;
  validFrom: string | null;
  validTo: string | null;
  cardStatus: number | null;
  isActive: boolean;
}

export interface GetAllClubMembersResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: {
    items: ClubMemberApiResponse[];
    totalCount?: number;
  };
}

export const getAllClubMembers = async () => {
  const response =
    await apiClient.get<GetAllClubMembersResponse>(
      '/user/GetAllClubMembers'
    );

  return response.data;
};