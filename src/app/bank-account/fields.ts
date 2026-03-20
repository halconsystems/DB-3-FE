import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const bankAccountFields: ProfileField[] = [
  { name: 'bankName', label: 'Bank Name', type: 'text', required: true, placeholder: 'Bank Name here' },
  { name: 'bankCode', label: 'Bank Code', type: 'text', required: true, placeholder: 'Enter (HABB, etc.)' },
  { name: 'accountNo', label: 'Account No.', type: 'text', required: true, placeholder: 'Account Number here' },
  { name: 'iban', label: 'IBAN', type: 'text', required: true, placeholder: 'IBAN here' },
  { name: 'branchCode', label: 'Branch Code', type: 'text', required: true, placeholder: 'Branch Code here' },
  { name: 'branch', label: 'Branch', type: 'text', required: true, placeholder: 'Branch here' },
];

export const mockBankAccountData: ProfileFormData = {
  bankName: '',
  bankCode: '',
  accountNo: '',
  iban: '',
  branchCode: '',
  branch: '',
};
