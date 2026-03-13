import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const vehicleFields: ProfileField[] = [
  { name: 'vehicleNo', label: 'Vehicle No', type: 'text', required: true, placeholder: 'ABC Only' , sameCellKey: 'vehicleNo', sameCellColumns: 2 , fieldWidth: "100%"},
  { name: 'vehicleNo2', label: 'Vehicle No', type: 'text', required: true, placeholder: 'Number Only' , sameCellKey: 'vehicleNo', fieldWidth: "100%"},
  { name: 'licensePlate', label: 'License Plate', type: 'text', required: true, placeholder: 'ABC-123' },
  { name: 'make', label: 'Make', type: 'text', required: true, placeholder: 'Manufacturer' },
  { name: 'model', label: 'Model', type: 'text', required: true, placeholder: 'Model Name' },
  { name: 'color', label: 'Color', type: 'text', required: true, placeholder: 'White' },
  { name: 'year', label: 'Year', type: 'select', required: true, options: [ { value: '2020', label: '2020' }, { value: '2021', label: '2021' }, { value: '2022', label: '2022' }, { value: '2023', label: '2023' }, { value: '2024', label: '2024' } ] },
  { name: 'eTagId', label: 'Vehicle E-Tag ID', type: 'text', required: true, placeholder: '996952346550' },
  { name: 'eTagType', label: 'E-Tag Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'type1', label: 'Type 1' }, { value: 'type2', label: 'Type 2' } ] },
  { name: 'issueDate', label: 'Issue Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: false, placeholder: 'Select Date' },
  { name: 'tagStatus', label: 'Tag Status', type: 'select', required: true, options: [ { value: '', label: 'Select here' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ]},
  { name: 'empty', label: '', type: 'text', required: false, placeholder: '', isHidden: true},
  { name: 'attachment', label: 'Attachment', type: 'file', required: false},
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
  eTagType: 'type1',
  issueDate: '2024-01-01',
  expiryDate: '2026-01-01',
  empty: null,
  tagStatus: 'active',
  attachment: null,
};
