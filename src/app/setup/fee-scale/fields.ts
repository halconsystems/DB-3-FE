import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const feeScaleFields: ProfileField[] = [
  { name: 'name' as keyof ProfileFormData, label: 'Name', type: 'text', required: true, placeholder: 'Enter Name' },
  { name: 'feeCategory' as keyof ProfileFormData, label: 'Fee Category', type: 'select', required: true, options: [
    { value: '', label: 'Select Fee Category' },
    { value: 'OneTime', label: 'One Time' },
    { value: 'Recurring', label: 'Recurring' }
  ]},
  { name: 'amount' as keyof ProfileFormData, label: 'Amount', type: 'text', required: true, placeholder: 'Enter Amount' },
  { name: 'description' as keyof ProfileFormData, label: 'Description', type: 'text', required: true, placeholder: 'Enter Description' },
  { name: 'applicableUserTypes' as keyof ProfileFormData, label: 'Applicable User Types', type: 'text', required: true, placeholder: 'Enter Applicable User Types' },
  { name: 'applicableVehicleCategory' as keyof ProfileFormData, label: 'Applicable Vehicle Category', type: 'select', required: true, options: [
    { value: '', label: 'Select Vehicle Category' },
    { value: 'Private', label: 'Private' },
    { value: 'Official', label: 'Official' },
    { value: 'Commercial User', label: 'Commercial User' }
  ]},
  { name: 'isTaxApplicable' as keyof ProfileFormData, label: 'Is Tax Applicable', type: 'statusSwitch', required: true },
  { name: 'taxPercentage' as keyof ProfileFormData, label: 'Tax Percentage', type: 'text', required: true, placeholder: 'Enter Tax Percentage' },
  { name: 'currency' as keyof ProfileFormData, label: 'Currency', type: 'text', required: true, placeholder: 'Enter Currency' },
  { name: 'status' as keyof ProfileFormData, label: 'Status', type: 'statusSwitch', required: false },
];

export const mockFeeScaleData: ProfileFormData = {};
