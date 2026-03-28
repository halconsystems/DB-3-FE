import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const tagFields: ProfileField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Name here' },
  { name: 'entityId', label: 'Entity ID', type: 'text', required: true, placeholder: 'Entity ID here' },
  { name: 'tagType', label: 'Tag Type', type: 'text', required: true, placeholder: 'Tag Type here' },
  { name: 'tagNumber', label: 'Tag Number', type: 'text', required: true, placeholder: 'Tag Number here' },
  { name: 'feeScaleId', label: 'Fee Scale ID', type: 'text', required: true, placeholder: 'Fee Scale ID here' },
  { name: 'planType', label: 'Plan Type', type: 'text', required: true, placeholder: 'Plan Type here' },
  { name: 'validFrom', label: 'Valid From', type: 'date', required: true, placeholder: 'Select start date' },
  { name: 'validTo', label: 'Valid To', type: 'date', required: true, placeholder: 'Select end date' },
  { name: 'zone', label: 'Zone', type: 'text', required: true, placeholder: 'Zone here' },
  { name: 'device', label: 'Device', type: 'text', required: true, placeholder: 'Device here' },
  { name: 'notes', label: 'Notes', type: 'text', required: false, placeholder: 'Notes here' },
  { name: 'status', label: 'Status', type: 'text', required: true, placeholder: 'Status here' },
];

export const mockTagData: ProfileFormData = {
  tagId: '1',
  name: 'Shahid Husain',
  entityId: '326523526',
  tagType: 'QR Code',
  tagNumber: '87253e23-B4df',
  feeScaleId: 'Monthly Package',
  planType: 'Monthly',
  validFrom: '2026-02-26',
  validTo: '2026-06-12',
  zone: 'Zone A',
  device: 'RFID',
  notes: 'Lorem Ipsum',
  status: 'Active',
  entityType: 'default',
};
