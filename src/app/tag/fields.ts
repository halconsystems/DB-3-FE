import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const tagFields: ProfileField[] = [
  { name: 'tagId', label: 'Tag ID', type: 'text', required: true, placeholder: 'Tag ID here' },
  { name: 'tagNumber', label: 'Tag Number', type: 'text', required: true, placeholder: 'Tag Number here' },
  { name: 'tagType', label: 'Tag Type', type: 'text', required: true, placeholder: 'Tag Type here' },
  { name: 'validFrom', label: 'Valid From', type: 'date', required: true, placeholder: 'Select start date' },
  { name: 'validTo', label: 'Valid To', type: 'date', required: true, placeholder: 'Select end date' },
  { name: 'entityType', label: 'Entity Type', type: 'text', required: true, placeholder: 'Entity Type here' },
  { name: 'entityId', label: 'Entity ID', type: 'text', required: true, placeholder: 'Entity ID here' },
  { name: 'vendorId', label: 'Vendor ID', type: 'text', required: true, placeholder: 'Vendor ID here' },
];

export const mockTagData: ProfileFormData = {
  tagId: '1',
  tagNumber: 'T-1001',
  tagType: 'RFID',
  validFrom: '2026-01-01',
  validTo: '2026-12-31',
  entityType: 'Vehicle',
  entityId: 'V-2001',
  vendorId: '1055',
  status: 'Active',
};
