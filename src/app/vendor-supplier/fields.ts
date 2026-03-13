import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const vendorFields: ProfileField[] = [
  { name: 'businessName', label: 'Business Name', type: 'text', required: true, placeholder: 'Business Name here' },
  { name: 'city', label: 'City', type: 'select', required: true, options: [ { value: '', label: 'Select city' } ] },
  { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Address here' },
  { name: 'emailAddress', label: 'Email Address', type: 'email', required: true, placeholder: 'Email Address here' },
  { name: 'contactPerson', label: 'Contact Person', type: 'text', required: true, placeholder: 'Contact Person Name here' },
  { name: 'cellNumber1', label: 'Add Cell Number 1', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cellNumber2', label: 'Add Cell Number 2', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'vendorId', label: 'Vender ID', type: 'text', required: true, placeholder: 'Auto generated (1055)' },
];

export const mockVendorData: ProfileFormData = {};
