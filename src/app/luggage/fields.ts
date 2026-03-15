import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const luggageFields: ProfileField[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'cnic', label: 'CNIC No.', type: 'text', required: false, placeholder: '(12345-1234567-1)' },
  { name: 'vehicleNo', label: 'Vehicle No', type: 'text', required: true, placeholder: 'ABC Only' },
  { name: 'vehicleNo2', label: 'Vehicle No', type: 'text', required: true, placeholder: 'Number Only' },
  { name: 'licensePlate', label: 'License Plate', type: 'text', required: false, placeholder: 'ABC-123' },
  { name: 'qrReference', label: 'QR Reference', type: 'text', required: false, placeholder: 'Type here' },
  { name: 'status', label: 'Status', type: 'select', required: false, options: [ { value: '', label: 'Select here' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] },
  { name: 'quickPick', label: 'Quick Pick', type: 'radio', required: true, colSpan: 2, options: [ { value: 'dayPass', label: 'Day Pass' }, { value: 'longStay', label: 'Long Stay' } ] },
  { name: 'fromDate', label: 'From Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'toDate', label: 'To Date', type: 'date', required: false, placeholder: 'Select Date' },
];

export const mockLuggageData: ProfileFormData = {};
