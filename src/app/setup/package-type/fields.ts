import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const packageFields: ProfileField[] = [
  { name: 'packageName' as keyof ProfileFormData, label: 'Package Name', type: 'text', required: true, placeholder: 'Package Name here' },
  { name: 'packageId' as keyof ProfileFormData, label: 'Package ID', type: 'text', required: true, placeholder: 'Package ID here' },
  { name: 'minCharges' as keyof ProfileFormData, label: 'Set Minimum Charges', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'minRenewalCharges' as keyof ProfileFormData, label: 'Set Minimum Renewal Charges', type: 'text', required: true, placeholder: '001' },
  { name: 'status' as keyof ProfileFormData, label: 'Status', type: 'statusSwitch', required: false },
];

export const mockPackageData: ProfileFormData = {};
