import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const vehicleFields: ProfileField[] = [
  { name: 'vehicleNo' as keyof ProfileFormData, label: 'Vehicle No', type: 'text', required: true, placeholder: 'ABC Only' , sameCellKey: 'vehicleNo', sameCellColumns: 2 , fieldWidth: "100%"},
  { name: 'vehicleNo2' as keyof ProfileFormData, label: 'Vehicle No', type: 'text', required: true, placeholder: 'Number Only' , sameCellKey: 'vehicleNo', fieldWidth: "100%"},
  { name: 'licensePlate' as keyof ProfileFormData, label: 'License Plate', type: 'text', required: true, placeholder: 'ABC-123', readOnly: true },
  { name: 'make' as keyof ProfileFormData, label: 'Make', type: 'text', required: true, placeholder: 'Manufacturer' },
  { name: 'model' as keyof ProfileFormData, label: 'Model', type: 'text', required: true, placeholder: 'Model Name' },
  { name: 'color' as keyof ProfileFormData, label: 'Color', type: 'text', required: true, placeholder: 'White' },
  { name: 'year' as keyof ProfileFormData, label: 'Year', type: 'select', required: true, options: [ { value: '2020', label: '2020' }, { value: '2021', label: '2021' }, { value: '2022', label: '2022' }, { value: '2023', label: '2023' }, { value: '2024', label: '2024' } ] },
  { name: 'eTagStatus' as keyof ProfileFormData, label: 'E-Tag Status', type: 'select', required: true, options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'lost', label: 'Lost' },
    { value: 'damaged', label: 'Damaged' },
  ] },
  { name: 'eTagId' as keyof ProfileFormData, label: 'Vehicle E-Tag ID', type: 'text', required: true, placeholder: '996952346550' },
  { name: 'issueDate' as keyof ProfileFormData, label: 'Issue Date', type: 'date', required: true, placeholder: 'Select Date' },
  { name: 'expiryDate' as keyof ProfileFormData, label: 'Expiry Date', type: 'date', required: true, placeholder: 'Select Date' },
  { name: 'tagStatus' as keyof ProfileFormData, label: 'Tag Status', type: 'statusSwitch', required: false },
  { name: 'attachment' as keyof ProfileFormData, label: 'Attachment', type: 'file', required: false},
];

export const mockVehicleData: ProfileFormData = {
  vehicleNo: 'ABC123',
  vehicleNo2: '123456',
  licensePlate: 'ABC-123',
  make: 'Toyota',
  model: 'Corolla',
  color: 'White',
  year: '2020',
  eTagId: '996952346550',
  issueDate: '2024-01-01',
  expiryDate: '2026-01-01',
  empty: null,
  tagStatus: 'active',
  attachment: null,
};
