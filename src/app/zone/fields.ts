import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const zoneFields: ProfileField[] = [
  { name: 'zoneName', label: 'Zone Name', type: 'text', required: true, placeholder: 'Zone Name here' },
  { name: 'phase', label: 'Phase', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
];

export const mockZoneData: ProfileFormData = {};
