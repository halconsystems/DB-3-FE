'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

const bankAccountFields: ProfileField[] = [
  { name: 'bankName', label: 'Bank Name', type: 'text', required: true, placeholder: 'Bank Name here' },
  { name: 'bankCode', label: 'Bank Code', type: 'text', required: true, placeholder: 'Enter (HABB, etc.)' },
  { name: 'accountNo', label: 'Account No.', type: 'text', required: true, placeholder: 'Account Number here' },
  { name: 'iban', label: 'IBAN', type: 'text', required: true, placeholder: 'IBAN here' },
  { name: 'branchCode', label: 'Branch Code', type: 'text', required: true, placeholder: 'Branch Code here' },
  { name: 'branch', label: 'Branch', type: 'text', required: true, placeholder: 'Branch here' },
];


const mockBankAccountData: ProfileFormData = {
  bankName: 'Habib Bank',
  bankCode: 'HABB',
  accountNo: '1234567890',
  iban: 'PK36HABB0000001234567890',
  branchCode: '001',
  branch: 'Main Branch',
};

export default function EditBankAccount() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    
    setTimeout(() => {
      setInitialValues(mockBankAccountData);
    }, 500);
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit Bank Account">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            fields={bankAccountFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



