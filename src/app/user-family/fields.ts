import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const userFamilyFields: ProfileField[] = [
  { name: 'name' as keyof ProfileFormData, label: 'Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'cellNumber' as keyof ProfileFormData, label: 'Phone', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic' as keyof ProfileFormData, label: 'CNIC No.', type: 'text', required: true, placeholder: '12345-1234567-1' },
  { name: 'relation' as keyof ProfileFormData, label: 'Relation', type: 'select', required: true, placeholder: 'Select Relation', options: [{ value: '', label: 'Select Relation' }, { value: 'spouse', label: 'Spouse' }, { value: 'child', label: 'Child' }, { value: 'parent', label: 'Parent' }, { value: 'sibling', label: 'Sibling' }] },
  { name: 'fatherHusbandName' as keyof ProfileFormData, label: 'Father/Husband Name', type: 'text', required: true, placeholder: 'Father or Husband Name' },
  { name: 'residentCardNo' as keyof ProfileFormData, label: 'Resident Card No.', type: 'text', required: true, placeholder: 'Resident Card Number' },
  { name: 'dob' as keyof ProfileFormData, label: 'Date of Birth', type: 'date', required: true, placeholder: 'Select DOB' },
  { name: 'validFrom' as keyof ProfileFormData, label: 'Valid From', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'validTo' as keyof ProfileFormData, label: 'Valid To', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'status' as keyof ProfileFormData, label: 'User Family Status', type: 'statusSwitch', required: false },
  { name: 'cardStatus' as keyof ProfileFormData, label: 'Card Status', type: 'select', required: true, placeholder: 'Select Card Status', options: [{ value: '', label: 'Select Card Status' }] },
];

export const mockUserFamilyData: ProfileFormData = {
  name: '',
  emailAddress: '',
  cellNumber: '',
  cnic: '',
  relation: '',
  fatherHusbandName: '',
  residentCardNo: '',
  dob: '',
  validFrom: '',
  validTo: '',
};
