import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const employeeFields: ProfileField[] = [
  { name: 'fullName' as keyof ProfileFormData, label: 'Employee Name', type: 'text', required: true, placeholder: 'Employee Name here' },
  { name: 'emailAddress' as keyof ProfileFormData, label: 'Email ID', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'cellNumber' as keyof ProfileFormData, label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic' as keyof ProfileFormData, label: 'CNIC No.', type: 'text', required: true, placeholder: '12345-1234567-1' },
  { name: 'role' as keyof ProfileFormData, label: 'Assign Role', type: 'select', required: true, placeholder: 'Select role', options: [] },
  { name: 'tempPassword' as keyof ProfileFormData, label: 'Temporary Password', type: 'text', required: true, placeholder: 'Temporary Password here' },
  { name: 'profilePicture' as keyof ProfileFormData, label: 'Profile Picture', type: 'file', required: false },
  { name: 'cnicFront' as keyof ProfileFormData, label: 'CNIC Front Image', type: 'file', required: false },
  { name: 'cnicBack' as keyof ProfileFormData , label: 'CNIC Back Image', type: 'file', required: false },
  { name: 'status' as keyof ProfileFormData, label: 'Employee Status', type: 'statusSwitch', required: false }
];

export const mockEmployeeData: ProfileFormData = {
  fullName: '',
  emailAddress: '',
  cellNumber: '',
  cnic: '',
  profilePicture: null,
  cnicFront: null,
  cnicBack: null,
  role: '',
  tempPassword: '',
};
