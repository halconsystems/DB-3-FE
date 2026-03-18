import apiClient from "../lib/apiClient";

export interface EmployeeUser {
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

export interface GetAllEmployeesResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: {
    items: EmployeeUser[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface GetEmployeeByIdResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: EmployeeUser | null;
}

export interface UpdateEmployeeRequest {
  Id: string;
  FullName: string;
  PhoneNumber: string;
  VehicleId?: string;
  RoleId: string;
  IsActive: boolean;
  ProfilePicture?: File | null;
  CNICFrontImage?: File | null;
  CNICBackImage?: File | null;
}

export interface UpdateEmployeeResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: EmployeeUser | null;
}

export interface RemoveEmployeeResponse {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: {
    token: string;
    expiration: string;
    email: string;
    fullName: string;
  } | null;
}

export const getAllEmployees = async (): Promise<GetAllEmployeesResponse> => {
  const { data } = await apiClient.get<GetAllEmployeesResponse>("/auth/GetAllUsers");
  return data;
};

export const getEmployeeById = async (
  id: string
): Promise<GetEmployeeByIdResponse> => {
  const { data } = await apiClient.get<GetEmployeeByIdResponse>(
    "/auth/GetUserById",
    { params: { Id: id } }
  );
  return data;
};

export const updateEmployee = async (
  employee: UpdateEmployeeRequest
): Promise<UpdateEmployeeResponse> => {
  const formData = new FormData();
  formData.append("Id", employee.Id);
  formData.append("FullName", employee.FullName);
  formData.append("PhoneNumber", employee.PhoneNumber);
  if (employee.VehicleId) {
    formData.append("VehicleId", employee.VehicleId);
  }
  formData.append("RoleId", employee.RoleId);
  formData.append("IsActive", String(employee.IsActive));
  if (employee.ProfilePicture) {
    formData.append("ProfilePicture", employee.ProfilePicture);
  }
  if (employee.CNICFrontImage) {
    formData.append("CNICFrontImage", employee.CNICFrontImage);
  }
  if (employee.CNICBackImage) {
    formData.append("CNICBackImage", employee.CNICBackImage);
  }

  const { data } = await apiClient.post<UpdateEmployeeResponse>(
    "/auth/update-user",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const removeEmployee = async (
  id: string
): Promise<RemoveEmployeeResponse> => {
  const { data } = await apiClient.post<RemoveEmployeeResponse>(
    "/auth/remove-user",
    { id }
  );
  return data;
};
