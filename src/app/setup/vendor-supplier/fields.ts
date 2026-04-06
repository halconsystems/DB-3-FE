import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const vendorFields: ProfileField[] = [
  { name: 'businessName' as keyof ProfileFormData, label: 'Business Name', type: 'text', required: true, placeholder: 'Business Name here' },
  { name: 'city' as keyof ProfileFormData, label: 'City', type: 'select', required: true, options: [ { value: '', label: 'Select city' }, { value: 'Karachi', label: 'Karachi' }, { value: 'Lahore', label: 'Lahore' } ] },
  { name: 'address' as keyof ProfileFormData, label: 'Address', type: 'text', required: true, placeholder: 'Address here' },
  { name: 'emailAddress' as keyof ProfileFormData, label: 'Email Address', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'contactPerson' as keyof ProfileFormData, label: 'Contact Person', type: 'text', required: true, placeholder: 'Contact Person Name here' },
  { name: 'cellNumber1' as keyof ProfileFormData, label: 'Add Cell Number 1', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cellNumber2' as keyof ProfileFormData, label: 'Add Cell Number 2', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'vendorId' as keyof ProfileFormData, label: 'Vendor ID', type: 'text', required: true, placeholder: 'Auto generated (1055)' },
  { name: 'status' as keyof ProfileFormData, label: 'Status', type: 'statusSwitch', required: false },
];

export const mockVendorData: ProfileFormData = {};
