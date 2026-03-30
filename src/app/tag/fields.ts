import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';
export const tagFields: ProfileField[] = [
  { name: 'tagId' as keyof ProfileFormData, label: 'Tag ID', type: 'select', required: true, placeholder: 'Select Tag Type', options: [] },
  { name: 'tagNumber' as keyof ProfileFormData, label: 'Tag Number', type: 'text', required: true, placeholder: 'Tag Number here' },
  { name: 'tagType' as keyof ProfileFormData, label: 'Tag Type', type: 'text', required: true, placeholder: 'Tag Type here' },
  { name: 'validFrom' as keyof ProfileFormData, label: 'Valid From', type: 'date', required: true, placeholder: 'Select start date' },
  { name: 'validTo' as keyof ProfileFormData, label: 'Valid To', type: 'date', required: true, placeholder: 'Select end date' },
  { name: 'entityType' as keyof ProfileFormData, label: 'Entity Type', type: 'text', required: true, placeholder: 'Entity Type here' },
  { name: 'entityId' as keyof ProfileFormData, label: 'Entity ID', type: 'text', required: true, placeholder: 'Entity ID here' }
];
export const mockTagData: ProfileFormData = {
  tagId: '1',
  tagNumber: 'T-1001',
  tagType: 'RFID',
  validFrom: '2026-01-01',
  validTo: '2026-12-31',
  entityType: 'Vehicle',
  entityId: 'V-2001',
  status: 'Active',
};
