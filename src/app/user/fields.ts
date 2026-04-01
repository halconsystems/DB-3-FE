import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const userFields: ProfileField[] = [
  { name: 'name' as keyof ProfileFormData, label: 'Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'emailAddress' as keyof ProfileFormData, label: 'Email', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'cellNumber' as keyof ProfileFormData, label: 'Phone', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic' as keyof ProfileFormData, label: 'CNIC No.', type: 'text', required: true, placeholder: '(12345-1234567-1)' },
  { name: 'userType' as keyof ProfileFormData, label: 'User Type', type: 'select', required: true, placeholder: 'Select User Type', options: [{ value: '', label: 'Select User Type' }, { value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }] },
  { name: 'rfidCardNo' as keyof ProfileFormData, label: 'RFID Card No.', type: 'text', required: true, placeholder: 'RFID Card Number' },
  { name: 'cardIssueDate' as keyof ProfileFormData, label: 'Card Issue Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'cardExpiryDate' as keyof ProfileFormData, label: 'Card Expiry Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'cardStatus' as keyof ProfileFormData, label: 'Card Status', type: 'select', required: true, options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
  { name: 'status' as keyof ProfileFormData, label: 'Status', type: 'select', required: true, options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
];

export const mockUserData: ProfileFormData = {
  name: '',
  emailAddress: '',
  cellNumber: '',
  cnic: '',
  userType: '',
  rfidCardNo: '',
  cardIssueDate: '',
  cardExpiryDate: '',
  cardStatus: 'active',
  status: 'active',
};
