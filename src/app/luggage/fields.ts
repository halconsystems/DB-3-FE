import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const luggageFields: ProfileField[] = [
  { name: 'fullName' as keyof ProfileFormData, label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'cnic' as keyof ProfileFormData, label: 'CNIC No.', type: 'text', required: false, placeholder: '(12345-1234567-1)' },
  { name: 'vehicleNo' as keyof ProfileFormData, label: 'Vehicle No', type: 'text', required: true, placeholder: 'ABC Only' },
  { name: 'vehicleNo2' as keyof ProfileFormData, label: 'Vehicle No', type: 'text', required: true, placeholder: 'Number Only' },
  { name: 'licensePlate' as keyof ProfileFormData, label: 'License Plate', type: 'text', required: false, placeholder: 'ABC-123', readOnly: true },
  { name: 'description' as keyof ProfileFormData, label: 'Description', type: 'text', required: false, placeholder: 'Type here' },
  { name: 'quickPick' as keyof ProfileFormData, label: 'Quick Pick', type: 'radio', required: true, colSpan: 2, options: [ { value: 'dayPass', label: 'Day Pass' }, { value: 'longStay', label: 'Long Stay' } ] },
  { name: 'fromDate' as keyof ProfileFormData, label: 'From Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'toDate' as keyof ProfileFormData, label: 'To Date', type: 'date', required: false, placeholder: 'Select Date' },
];

export const mockLuggageData: ProfileFormData = {};
