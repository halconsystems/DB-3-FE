import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const phaseFields: ProfileField[] = [
  { name: 'phaseName', label: 'Phase Name', type: 'text', required: true, placeholder: 'Phase Name here' },
  { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Description here' },
  { name: 'status', label: 'Status', type: 'statusSwitch', required: false },
];

export const mockPhaseData: ProfileFormData = {};
