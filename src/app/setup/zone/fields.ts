import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const zoneFields: ProfileField[] = [
  { name: 'zoneName' as keyof ProfileFormData, label: 'Zone Name', type: 'text', required: true, placeholder: 'Zone Name here' },
  { name: 'phase' as keyof ProfileFormData, label: 'Phase', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
];

export const mockZoneData: ProfileFormData = {};
