import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const visitorFields: ProfileField[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Full Name here' },
  { name: 'cnic', label: 'CNIC No.', type: 'text', required: false, placeholder: '(12345-1234567-1)' },
  { name: 'vehicleNo', label: 'Vehicle No', type: 'text', required: false, placeholder: 'ABC Only' , sameCellColumns: 2, sameCellKey: 'vehicleNoGroup', fieldWidth: '100%' },
  { name: 'vehicleNo2', label: 'Vehicle No', type: 'text', required: false, placeholder: 'Number Only' , sameCellKey: 'vehicleNoGroup', fieldWidth: '100%' },
  { name: 'licensePlate', label: 'License Plate', type: 'text', required: false, placeholder: 'ABC-123', readOnly: true },
  { name: 'description', label: 'Description', type: 'text', required: false, placeholder: 'Type here' },
  { name: 'quickPick', label: 'Quick Pick', type: 'radio', required: true, colSpan: 2, options: [ { value: 'day', label: 'Day Pass' }, { value: 'long', label: 'Long Stay' } ] },
  { name: 'fromDate', label: 'From Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'toDate', label: 'To Date', type: 'date', required: false, placeholder: 'Select Date' },
];

export const mockVisitorData: ProfileFormData = {
  fullName: 'John Doe',
  cnic: '12345-1234567-1',
  vehicleNo: 'ABC',
  vehicleNo2: '123',
  licensePlate: 'ABC-123',
  qrReference: 'QR-REF-001',
  quickPick: 'day',
  fromDate: '2026-03-09',
  toDate: '2026-03-10',
};
