export interface User {
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

export interface GetAllUsersResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: {
    items: User[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: {
    token: string;
    expiration: string;
    email: string;
    fullName: string;
  };
}

export interface RegisterRequest {
  FullName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  VehicleId?: string;
  CNIC: string;
  RoleId: string;
  ProfilePicture?: File;
  CNICFrontImage?: File;
  CNICBackImage?: File;
}

export interface RegisterResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: any;
}
