import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const employeeFields: ProfileField[] = [
  { name: 'fullName', label: 'Employee Name', type: 'text', required: true, placeholder: 'Employee Name here' },
  { name: 'emailAddress', label: 'Email ID', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'cellNumber', label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic', label: 'CNIC No.', type: 'text', required: true, placeholder: '(12345-1234567-1)' },
  { name: 'role', label: 'Assign Role', type: 'select', required: true, placeholder: 'Select role', options: [] },
  { name: 'tempPassword', label: 'Temporary Password', type: 'text', required: true, placeholder: 'Temporary Password here' },
  { name: 'profilePicture', label: 'Profile Picture', type: 'file', required: false },
  { name: 'cnicFront', label: 'CNIC Front Image', type: 'file', required: false },
  { name: 'cnicBack', label: 'CNIC Back Image', type: 'file', required: false }
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
