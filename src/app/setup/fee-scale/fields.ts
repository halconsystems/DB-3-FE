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
  { name: 'applicableUserTypes' as keyof ProfileFormData, label: 'Applicable User Types', type: 'select', required: true, options: [
    { value: '', label: 'Select User Type' }
  ] },
  { name: 'applicableVehicleCategory' as keyof ProfileFormData, label: 'Applicable Vehicle Category', type: 'select', required: true, options: [
    { value: '', label: 'Select Vehicle Category' },
    { value: 'Private', label: 'Private' },
    { value: 'Official', label: 'Official' },
    { value: 'Commercial User', label: 'Commercial User' }
  ]},
  { name: 'isTaxApplicable' as keyof ProfileFormData, label: 'Is Tax Applicable', type: 'statusSwitch', required: true },
  { name: 'taxPercentage' as keyof ProfileFormData, label: 'Tax Percentage', type: 'text', required: true, placeholder: 'Enter Tax Percentage' },
  { name: 'discountPercentage' as keyof ProfileFormData, label: 'Discount Percentage', type: 'text', required: false, placeholder: 'Enter Discount Percentage' },
  { name: 'mdrPercentage' as keyof ProfileFormData, label: 'MDR Percentage', type: 'text', required: false, placeholder: 'Enter MDR Percentage' },
  { name: 'fedTaxPercentage' as keyof ProfileFormData, label: 'FED Tax Percentage', type: 'text', required: false, placeholder: 'Enter FED Tax Percentage' },
  { name: 'discountValidFrom' as keyof ProfileFormData, label: 'Discount Valid From', type: 'date', required: false },
  { name: 'discountValidTo' as keyof ProfileFormData, label: 'Discount Valid To', type: 'date', required: false },
  { name: 'currency' as keyof ProfileFormData, label: 'Currency', type: 'text', required: true, placeholder: 'Enter Currency' }
];

export const mockFeeScaleData: ProfileFormData = {
  name: 'string',
  feeCategory: 'oneTime',
  amount: 0,
  description: 'string',
  applicableUserTypes: '',
  applicableVehicleCategory: 'private',
  isTaxApplicable: true,
  taxPercentage: 0,
  discountPercentage: 0,
  mdrPercentage: 0,
  fedTaxPercentage: 0,
  discountValidFrom: new Date().toISOString(),
  discountValidTo: new Date().toISOString(),
  currency: 'string',
  createdBy: 'string',
};
