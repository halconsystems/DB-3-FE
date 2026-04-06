import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const bankAccountFields: ProfileField[] = [
  { name: 'bankName' as keyof ProfileFormData, label: 'Bank Name', type: 'text', required: true, placeholder: 'Bank Name here' },
  { name: 'bankCode' as keyof ProfileFormData, label: 'Bank Code', type: 'text', required: true, placeholder: 'Enter (HABB, etc.)' },
  { name: 'accountNo' as keyof ProfileFormData, label: 'Account No.', type: 'text', required: true, placeholder: 'Account Number here' },
  { name: 'iban' as keyof ProfileFormData, label: 'IBAN', type: 'text', required: true, placeholder: 'IBAN here' },
  { name: 'branchCode' as keyof ProfileFormData, label: 'Branch Code', type: 'text', required: true, placeholder: 'Branch Code here' },
  { name: 'branch' as keyof ProfileFormData, label: 'Branch', type: 'text', required: true, placeholder: 'Branch here' },
  { name: 'status' as keyof ProfileFormData, label: 'Status', type: 'statusSwitch', required: false },
];

export const mockBankAccountData: ProfileFormData = {
  bankName: '',
  bankCode: '',
  accountNo: '',
  iban: '',
  branchCode: '',
  branch: '',
};
