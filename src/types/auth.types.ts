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
  VehicleId: string;
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
