import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const packageFields: ProfileField[] = [
  { name: 'packageName', label: 'Package Name', type: 'text', required: true, placeholder: 'Package Name here' },
  { name: 'packageId', label: 'Package ID', type: 'text', required: true, placeholder: 'Package ID here' },
  { name: 'minCharges', label: 'Set Minimum Charges', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'minRenewalCharges', label: 'Set Minimum Renewal Charges', type: 'text', required: true, placeholder: '001' },
];

export const mockPackageData: ProfileFormData = {};
