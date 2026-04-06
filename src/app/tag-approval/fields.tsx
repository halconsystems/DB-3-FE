import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const tagFields: ProfileField[] = [
  { name: 'name' as keyof ProfileFormData, label: 'Name', type: 'text', required: true, placeholder: 'Name here' },
  { name: 'entityId' as keyof ProfileFormData, label: 'Entity ID', type: 'text', required: true, placeholder: 'Entity ID here' },
  { name: 'tagType' as keyof ProfileFormData, label: 'Tag Type', type: 'text', required: true, placeholder: 'Tag Type here' },
  { name: 'tagNumber' as keyof ProfileFormData, label: 'Tag Number', type: 'text', required: true, placeholder: 'Tag Number here' },
  { name: 'feeScaleId' as keyof ProfileFormData, label: 'Fee Scale ID', type: 'text', required: true, placeholder: 'Fee Scale ID here' },
  { name: 'planType' as keyof ProfileFormData, label: 'Plan Type', type: 'text', required: true, placeholder: 'Plan Type here' },
  { name: 'validFrom' as keyof ProfileFormData, label: 'Valid From', type: 'date', required: true, placeholder: 'Select start date' },
  { name: 'validTo' as keyof ProfileFormData, label: 'Valid To', type: 'date', required: true, placeholder: 'Select end date' },
  { name: 'zone' as keyof ProfileFormData, label: 'Zone', type: 'text', required: false, placeholder: 'Zone here' },
  { name: 'device' as keyof ProfileFormData, label: 'Device', type: 'text', required: false, placeholder: 'Device here' },
  { name: 'notes' as keyof ProfileFormData, label: 'Notes', type: 'text', required: false, placeholder: 'Notes here' },
  { name: 'planType' as keyof ProfileFormData, label: 'Plan Type', type: 'text', required: false, placeholder: 'Plan Type here' },
  { name: 'status' as keyof ProfileFormData, label: 'Status', type: 'text', required: true, placeholder: 'Status here' },
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