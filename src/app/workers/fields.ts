import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const workerFields: ProfileField[] = [
  { name: 'search' as keyof ProfileFormData, label: 'Search (If already registered)', type: 'text', required: false, placeholder: 'Type Membership No. / CNIC / Reg. Cell No.' },
  { name: 'jobType' as keyof ProfileFormData, label: 'Select Job Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'driver', label: 'Driver' }, { value: 'cook', label: 'Cook' }, { value: 'guard', label: 'Guard' }, { value: 'peon', label: 'Peon' }, { value: 'gardener', label: 'Gardener' } ] },
  { name: 'fullName' as keyof ProfileFormData, label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'fatherOrHusband' as keyof ProfileFormData, label: 'Father / Husband Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'dob' as keyof ProfileFormData, label: 'Date of Birth (DOB)', type: 'date', required: true, placeholder: 'Select Date' },
  { name: 'cellNumber' as keyof ProfileFormData, label: 'Add Cell Number', type: 'text', required: true, placeholder: '0300-1234567' },
  { name: 'cnic' as keyof ProfileFormData, label: 'CNIC / NICOP No.', type: 'text', required: false, placeholder: '(12345-1234567-1)' },
  { name: 'policeVerification' as keyof ProfileFormData, label: 'Police Verification', type: 'select', required: true, options: [ { value: '', label: 'Select (Yes/No)' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' } ] },
  { name: 'cardDelivery' as keyof ProfileFormData, label: `Select Worker's Card Delivery`, type: 'select', required: false, options: [ { value: '', label: 'Select here' }, { value: 'owner', label: 'Owner/Employer Address' }, { value: 'self', label: 'Self Pick Up' } ] },
  { name: 'address' as keyof ProfileFormData, label: 'Select Address / Location', type: 'text', required: false, placeholder: 'Select here' },
  { name: 'cardNo' as keyof ProfileFormData, label: 'Card No. / ID', type: 'text', required: false, placeholder: 'Type here' },
  { name: 'issueDate' as keyof ProfileFormData, label: 'Issue Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'expiryDate' as keyof ProfileFormData, label: 'Expiry Date', type: 'date', required: true, placeholder: 'Select Date' },
  { name: 'cardStatus' as keyof ProfileFormData,  label: 'Card Status',  type: 'select',  required: true,  options: [ { value: '',  label: 'Select here' },  { value: 'active',  label: 'Active' },  { value: 'inactive',  label: 'Inactive'} ] },
  { name: 'profilePicture' as keyof ProfileFormData,  label: 'Profile Picture',  type: 'file',  required: true },
  { name: 'policeVerificationFile' as keyof ProfileFormData,  label: 'Police Verification+',  type: 'file',  required: false,  placeholder: 'If Yes Add Picture'},
  { name: 'cnicFront' as keyof ProfileFormData, label: 'CNIC Front', type: 'file', required: true },
  { name: 'cnicBack' as keyof ProfileFormData, label: 'CNIC Back', type: 'file', required: true },
];

export const mockWorkerData: ProfileFormData = {};
