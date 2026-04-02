import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const feeScaleFields: ProfileField[] = [
  { name: 'serviceType' as keyof ProfileFormData, label: 'Service Type', type: 'text', required: true, placeholder: 'Enter Service Type' },
  { name: 'userCategory' as keyof ProfileFormData, label: 'User Category', type: 'select', required: true, options: [
    { value: '', label: 'Select User Category' },
    { value: 'Worker', label: 'Worker' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' }
  ]},
  { name: 'vehicleCategory' as keyof ProfileFormData, label: 'Vehicle Category', type: 'select', required: true, options: [
    { value: '', label: 'Select Vehicle Category' },
    { value: 'Private', label: 'Private' },
    { value: 'Official', label: 'Official' },
    { value: 'Commercial User', label: 'Commercial User' }
  ]},
  { name: 'feeCategory' as keyof ProfileFormData, label: 'Fee Category', type: 'text', required: true, placeholder: 'Enter Fee Category' },
  { name: 'packageName' as keyof ProfileFormData, label: 'Package Name', type: 'text', required: true, placeholder: 'Enter Package Name' },
  { name: 'amount' as keyof ProfileFormData, label: 'Amount', type: 'text', required: true, placeholder: 'Enter Amount' },
  { name: 'taxPercentage' as keyof ProfileFormData, label: 'Tax Percentage', type: 'text', required: true, placeholder: 'Enter Tax Percentage' },
  { name: 'description' as keyof ProfileFormData, label: 'Description', type: 'text', required: false, placeholder: 'Enter Description' },
  { name: 'status' as keyof ProfileFormData, label: 'Status', type: 'statusSwitch', required: false },
];

export const mockFeeScaleData: ProfileFormData = {};
